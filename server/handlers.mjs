import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { AppError, PRODUCTS, validateIID } from '../public/core.mjs';
import { obtainCID, readBody } from './provider.mjs';
const COOKIE='nova_activation_session';
const JSON_HEADERS={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, max-age=0','Pragma':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const hash=value=>createHash('sha256').update(value).digest();
const equal=(a,b)=>timingSafeEqual(hash(String(a)),hash(String(b)));
const sign=(body,key)=>createHmac('sha256',key).update(`nova-activation-v1:${body}`).digest('base64url');
const json=(body,status=200,headers={})=>new Response(JSON.stringify(body),{status,headers:{...JSON_HEADERS,...headers}});
function validateOrigin(request) {
  const origin=request.headers.get('Origin');
  if(!origin||origin!==new URL(request.url).origin||request.headers.get('Sec-Fetch-Site')==='cross-site')throw new AppError('ORIGIN_REJECTED','Abre la consulta desde esta aplicación.',403);
}
async function jsonInput(request,limit=4096) {
  if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new AppError('JSON_REQUIRED','Usa el formulario de la aplicación.',415);
  let data;try{data=JSON.parse(await readBody(request,limit));}catch(error){if(error instanceof AppError)throw error;throw new AppError('JSON_INVALID','No se pudo leer la solicitud.');}
  if(!data||typeof data!=='object'||Array.isArray(data))throw new AppError('JSON_INVALID','No se pudo leer la solicitud.');
  return data;
}
export function createHandlers({env=process.env,fetcher=fetch,now=Date.now,uuid=randomUUID,localDev=false}={}) {
  const access=()=>typeof env.NOVA_ACCESS_CODE==='string'?env.NOVA_ACCESS_CODE.trim():'';
  const token=()=>typeof env.ACTIVATION_API_TOKEN==='string'?env.ACTIVATION_API_TOKEN.trim():'';
  const accessReady=()=>access().length>=16&&access().length<=256;
  const providerReady=()=>/^[\x21-\x7E]{1,256}$/.test(token());
  const cookie=(value,clear=false)=>`${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict${localDev?'':'; Secure'}${clear?'; Max-Age=0':''}`;
  function authorized(request) {
    if(!accessReady())return false;
    const value=request.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
    if(!value||value.length>2048)return false;
    const [body,signature,extra]=value.split('.');if(!body||!signature||extra||!equal(signature,sign(body,access())))return false;
    try { const payload=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));return payload.v===1&&Number.isSafeInteger(payload.exp)&&payload.exp>now()&&payload.exp<=now()+8*60*60*1000; }catch{return false;}
  }
  function requireSession(request){if(!authorized(request))throw new AppError('SESSION_REQUIRED','Inicia sesión para realizar la consulta.',401);}
  async function guarded(handler){try{return await handler();}catch(error){if(error instanceof AppError)return json({ok:false,code:error.code,message:error.message},error.status);return json({ok:false,code:'UNEXPECTED','message':'No se pudo completar la solicitud. Revisa el historial del servicio antes de repetirla.'},500);}}
  return {
    session:request=>guarded(async()=>{
      if(!['POST','DELETE'].includes(request.method))return json({ok:false,message:'Método no permitido.'},405,{Allow:'POST, DELETE'});
      validateOrigin(request);
      if(request.method==='DELETE')return json({ok:true},200,{'Set-Cookie':cookie('',true)});
      if(!accessReady())throw new AppError('ACCESS_NOT_CONFIGURED','El acceso está pendiente de configuración por el administrador.',503);
      const data=await jsonInput(request,1024);
      const code=typeof data.code==='string'?data.code.trim():'';
      if(code.length>256||!equal(code,access()))throw new AppError('ACCESS_DENIED','La clave de acceso no es correcta.',401);
      const body=Buffer.from(JSON.stringify({v:1,exp:now()+8*60*60*1000,nonce:uuid()})).toString('base64url');
      return json({ok:true},200,{'Set-Cookie':cookie(`${body}.${sign(body,access())}`)});
    }),
    status:request=>guarded(async()=>{
      if(request.method!=='GET')return json({ok:false,message:'Método no permitido.'},405,{Allow:'GET'});
      requireSession(request);
      return json({ok:true,providerConfigured:providerReady(),liveCheckPerformed:false,version:'1.1.0'});
    }),
    confirmation:request=>guarded(async()=>{
      if(request.method!=='POST')return json({ok:false,message:'Método no permitido.'},405,{Allow:'POST'});
      validateOrigin(request);requireSession(request);
      const data=await jsonInput(request);
      if(!PRODUCTS.includes(data.product))throw new AppError('PRODUCT_INVALID','Selecciona el producto instalado.');
      const iid=validateIID(data.iid);
      if(!providerReady())throw new AppError('PROVIDER_NOT_CONFIGURED','La conexión del servicio está pendiente de configuración.',503);
      // Exactly one upstream attempt. No automatic retry or simulated response.
      const cid=await obtainCID(iid,token(),fetcher);
      return json({ok:true,cid,id:uuid(),receivedAt:new Date(now()).toISOString()});
    })
  };
}
