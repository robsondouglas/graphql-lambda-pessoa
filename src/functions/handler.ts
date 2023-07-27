import { App } from "../app/app";

const success = (body:any)=>({
   isBase64Encoded: false,
   statusCode: 200,
   body: JSON.stringify(body),
   headers: { "content-type": "application/json"}
 });

 const fail = (err:Error)=>({
   isBase64Encoded: false,
   statusCode: 500,
   body: err.message,
   headers: { "content-type": "application/json"}
 });

const exec = async(hnd:(app:App)=>any)=>{
   try
   { return success(await hnd(new App())); }
   catch(ex)
   { return fail(ex); }
}

export const add     = async (event) => await exec((app) => app.add(JSON.parse(event.body)));
export const append  = async (event) => await exec((app) => app.append(JSON.parse(event.body)));
export const read    = async (event) => await exec((app) => app.read(JSON.parse(event.body)));
export const list    = async (event) => await exec((app) => app.list(JSON.parse(event.body)));
export const answer  = async (event) => await exec((app) => app.answer(JSON.parse(event.body)));
