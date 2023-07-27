import ITopic from "src/adapters/topic/models";
import { Cidadao } from "./cidadao";
import { IFilter, IPK, IRequestAdd } from "./cidadao/models";
import { IIdentity } from "src/adapters/identity/models";
import { Context } from "src/libs/base";

export default class App{
    
    constructor(private ctx: Context, private cidadao:Cidadao, private topic: ITopic, private identity:IIdentity){
    }

    readCidadao(key:IPK){
        return this.ctx.transaction(()=> this.cidadao.get(key));
    }

    listCidadaos(filter:IFilter){
        return this.ctx.transaction(()=> this.cidadao.search(filter));
    }

    async addCidadao(itm:IRequestAdd){
        return await this.ctx.transaction(async()=> {
            const {User} = await this.identity.addUser( { Nome: itm.Nome, Email: itm.Email } )
            
            itm.IdUsuario = User.Username;
            const key = await this.cidadao.add(itm)
            await this.topic.publish(process.env.TOPIC_CIDADAO, 'INSERTED', {...itm, ...key})
            return key; 
        });
    }

    toggleCidadao(key:IPK){
        return this.ctx.transaction(async()=> {
            const Status = await this.cidadao.toggle(key)
            await this.topic.publish(process.env.TOPIC_CIDADAO, 'TOGGLED', {...key, Status})
            return Status;
        });
    }
}