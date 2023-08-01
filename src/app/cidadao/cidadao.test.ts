import { addDays } from "../../libs/utils";
import { Cidadao } from ".";
import { IRequestAdd } from "./models";
import MESSAGES from "../../libs/messages";
import { Context } from "../../libs/base";
import { randomUUID } from "crypto";
        

describe('CIDADAO', ()=>{
    const ctx = new Context(process.env.MONGO_URL, process.env.MONGO_DB);
    const cidadao:Cidadao = new Cidadao(ctx);
    
    const checkValidation = async(itm:IRequestAdd)=>{
        await expect(cidadao.add({...itm, Nascimento: addDays(new Date(), 1)  })).rejects.toThrow(MESSAGES.Errors.Cidadao.AGE_MIN);
        await expect(cidadao.add({...itm, Nascimento: new Date(1800,0,1)})).rejects.toThrow(MESSAGES.Errors.Cidadao.AGE_MAX);        
        await expect(cidadao.add({...itm, Email: null})).rejects.toThrow(MESSAGES.Errors.Cidadao.EMAIL_REQUIRED);        
        await expect(cidadao.add({...itm, Email: 'teste.com.br'})).rejects.toThrow(MESSAGES.Errors.Cidadao.EMAIL_FORMAT);        
    }

    it('ADD', async()=>{
        await ctx.transaction(async()=> {
            const itm : IRequestAdd = { Email: `add_${randomUUID()}@teste.com`, Nascimento: new Date(), Nome: 'TESTE', Sexo: 'M', CNH: '123456789' };
            await checkValidation(itm);
            await expect(cidadao.add({...itm, Nascimento: new Date(1980,7,12)})).resolves.not.toThrow();
        })
    });

    

    it('UPDATE', async()=>{
        const itm : IRequestAdd = { Email: `edit_${randomUUID()}@teste.com`, Nascimento: new Date(1980,7,12), Nome: 'TESTE', Sexo: 'M', CNH: '123456789' };

        await ctx.transaction(async()=>{
            const pk = await cidadao.add(itm);
            
            await checkValidation({...pk, ...itm});

            await expect(cidadao.edit({...pk, ...itm, Nome: 'TESTE EDITADO'})).resolves.not.toThrow();  
            await expect(cidadao.get({...pk})).resolves.toMatchObject({Nome: 'TESTE EDITADO'});
        })
          
    })

    it('TOGGLE', async()=>{
        await ctx.transaction(async()=>{
            const itm:IRequestAdd = { Email: `toggle_${randomUUID()}@teste.com`, Nascimento: new Date(1980,7,12), Nome: 'TESTE', Sexo: 'M', CNH: '123456789' };
            const pk = await cidadao.add(itm)        

            await expect(cidadao.get(pk)).resolves.toMatchObject({Status: 'A'})
            await expect(cidadao.toggle(pk)).resolves.not.toThrow();
            await expect(cidadao.get(pk)).resolves.toMatchObject({Status: 'I'})
            await expect(cidadao.toggle(pk)).resolves.not.toThrow();
            await expect(cidadao.get(pk)).resolves.toMatchObject({Status: 'A'})
            
            await cidadao.del(pk);
            await expect(cidadao.get(pk)).resolves.toBeNull();
        })
                
    })

    it('READ', async()=>{
        await ctx.transaction(async()=>{
            const itm:IRequestAdd = {Email: `read_${randomUUID()}@teste.com`, Nascimento: new Date(1980,7,12), Nome: 'TESTE', Sexo: 'M', CNH: '123456789' };
            const pk = await cidadao.add(itm)        
            console.log(pk)
            await expect(cidadao.get(pk)).resolves.toMatchObject(itm)
            await cidadao.toggle(pk)
            await expect(cidadao.get(pk)).resolves.toMatchObject(itm)

            await cidadao.del(pk)
            await expect(cidadao.get(pk)).resolves.toBeNull();
        });
    });

    it('DELETE', async()=>{
        await ctx.transaction(async()=>{
            const itm:IRequestAdd = { Email: `del_${randomUUID()}@teste.com`, Nascimento: new Date(1980,7,12), Nome: 'TESTE', Sexo: 'M', CNH: '123456789' };
            const pk = await cidadao.add(itm)        

            await expect(cidadao.del(pk)).resolves.not.toThrow();
            await expect(cidadao.del(pk)).rejects.toThrow(MESSAGES.Errors.defaults.NOT_FOUND);
        });
    })

    it('TOGGLE', async()=>{
        await ctx.transaction(async()=>{
            const itm:IRequestAdd = { Email: `toggle_${randomUUID()}@teste.com`, Nascimento: new Date(1980,7,12), Nome: 'TESTE', Sexo: 'M', CNH: '123456789' };
            const pk = await cidadao.add(itm)        

            await expect(cidadao.toggle(pk)).resolves.toMatchObject({Status: 'I'});
            await expect(cidadao.toggle(pk)).resolves.toMatchObject({Status: 'A'});

        });
    })


    it('SEARCH', async()=>{
        
        const prefix = randomUUID();
        
        await ctx.transaction(async()=>{
            const res = await Promise.all(Array.from({length: 25}).map( (_, idx)=>
                ({ Email: `search_${randomUUID()}@teste.com`, Nome: `${prefix}_TESTE ${idx+1}`, Nascimento: new Date(1980, 0, 1), Sexo: (idx % 2) == 0 ? 'M' : 'F', CNH: '123456789'})
            ).map( async(itm:IRequestAdd) => await cidadao.add(itm)))
            
            expect(res).toHaveLength(25);

            await expect(cidadao.search( { Page: 0, Nome: `${prefix}_TESTE` } )).resolves.toHaveLength(15);
            await expect(cidadao.search( { Page: 1, Nome: `${prefix}_TESTE` } )).resolves.toHaveLength(10);
            await expect(cidadao.search( { Page: 0, Nome: `${prefix}_TESTE 1`  } )).resolves.toHaveLength(11);

            const [toggled] = await cidadao.search( { Page: 0, Nome: `${prefix}_TESTE 10`  });
            await cidadao.toggle( toggled );
            await expect(cidadao.search( { Page: 0, Nome: `${prefix}_TESTE 1`  } )).resolves.toHaveLength(11);
            
            const [deleted] = await cidadao.search( { Page: 0, Nome: `${prefix}_TESTE 11`  });
            await cidadao.del( deleted );
            await expect(cidadao.search( { Page: 0, Nome: `${prefix}_TESTE 1`  } )).resolves.toHaveLength(10);
        });
    })
})