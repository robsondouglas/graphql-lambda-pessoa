import ITopic from "src/adapters/topic/models";
import { Cidadao } from "./cidadao";
import { IFK, IFilter, IPK, IRequestAdd } from "./cidadao/models";
import { IIdentity } from "src/adapters/identity/models";
import { Context } from "src/libs/base";

export default class App{
    
    constructor(private ctx: Context, private cidadao:Cidadao, private topic: ITopic, private identity:IIdentity){
    }

    async getCidadao(key:IPK){
        return await this.ctx.transaction(()=> this.cidadao.get(key));
    }

    async findCidadao(key:IFK){
        return await this.ctx.transaction(()=> this.cidadao.find(key));
    }

    async listCidadaos(filter:IFilter){
        return await this.ctx.transaction(()=> this.cidadao.search(filter));
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

    async toggleCidadao(key:IPK){
        return await this.ctx.transaction(async()=> {
            const Status = await this.cidadao.toggle(key)
            await this.topic.publish(process.env.TOPIC_CIDADAO, 'TOGGLED', {...key, Status})
            return Status;
        });
    }
}