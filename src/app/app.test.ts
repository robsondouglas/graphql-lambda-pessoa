import {default as MockTopic} from "../adapters/topic/mocked"
import {default as MockIdentity} from "../adapters/identity/mocked"
import App from "."
import { Cidadao } from "./cidadao"
import { Context } from "../libs/base"

describe('APP', ()=>{
    const dbCtx = new Context(process.env.MONGO_URL, process.env.MONGO_DB);
    let app : App = new App(dbCtx, new Cidadao(dbCtx), new MockTopic(), new MockIdentity())

    it('ADD', async()=>{
        await expect(app.addCidadao( { Nome: 'Teste', Nascimento: new Date(1980, 0, 0), Sexo: 'M', CNH: '123456', Email: 'jedaror883@paldept.com',  } )).resolves.not.toThrow();        
     })
    
     it('TOGGLE', async()=>{
        const res = await app.addCidadao( { Nome: 'Teste', Nascimento: new Date(1980, 0, 0), Sexo: 'M', CNH: '123456', Email: 'jedaror883@paldept.com',  } )
        await expect(app.toggleCidadao( res )).resolves.toMatchObject({Status: 'I'});        
     })
      
})