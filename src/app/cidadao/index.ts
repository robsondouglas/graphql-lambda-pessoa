import MESSAGES from "../../libs/messages";
import { IFK, IFilter, IPK, IRequestAdd, IResponseGet, IStatus } from "./models";
import {ObjectId} from 'mongodb'
import { getAge } from "../../libs/utils";
import { Base, Context } from "../../libs/base";
    
export class Cidadao extends Base{
    
    constructor(context:Context){
        super('cidadao', context)
    }

    private validate(data: IRequestAdd){
        const now = new Date()
        
        if(!data.Email)
        { throw new Error(MESSAGES.Errors.Cidadao.EMAIL_REQUIRED) }

        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.Email))
        { throw new Error(MESSAGES.Errors.Cidadao.EMAIL_FORMAT) }
        
        if(data.Nascimento > now)
        { throw new Error(MESSAGES.Errors.Cidadao.AGE_MIN) }

        if( getAge(data.Nascimento, now).anos > 150 )
        {  throw new Error(MESSAGES.Errors.Cidadao.AGE_MAX) }
        
    }

    async add(data:  IRequestAdd):Promise<IPK>{
        this.validate(data)
        const {insertedId} = await this.run(coll => coll.insertOne({...data, DateAdd: new Date(), Status: 'A'}));
        return { IdCidadao: insertedId.toString()  }
    }

    async edit({IdCidadao, ...data} : Omit<IRequestAdd, "Status" | "DateAdd"> & IPK):Promise<void>{
        this.validate(data);
        const itm = await this.get({IdCidadao})
        if(itm)
        { await this.run(coll => coll.updateOne({_id: new ObjectId(IdCidadao) }, {$set: {...data }})); }   
        else
        { throw new Error(MESSAGES.Errors.defaults.NOT_FOUND) }
    }

    async get(uk:IPK):Promise<IResponseGet>{
        const itm =  await this.run(coll => coll.findOne({ _id: new ObjectId(uk.IdCidadao), Status: { '$ne': 'C' } }));
        if(itm){
            const {_id, ...res } = itm;
            return {IdCidadao: _id.toString(), ...res};
        }
        else{
            return null;
        }
    }

    async find(fk:IFK):Promise<IResponseGet>{
        const itm =  await this.run(coll => coll.findOne({ IdUsuario: fk.IdUsuario, Status: { '$ne': 'C' } }));
        if(itm){
            const {_id, ...res } = itm;
            return {IdCidadao: _id.toString(), ...res};
        }
        else{
            return null;
        }
    }

    async del(uk:IPK):Promise<void>{
        const res = await this.run(coll => coll.updateOne({_id: new ObjectId(uk.IdCidadao), Status: { '$ne': 'C' }}, { $set: {Status: 'C'} }));
        
        if(res.matchedCount === 0)
        { throw new Error(MESSAGES.Errors.defaults.NOT_FOUND) }
    }

    async toggle(uk:IPK):Promise<IStatus>{
        const itm = await this.get(uk)
        if(itm)
        { 
            const Status = itm.Status === 'A' ? 'I' : 'A'
            await this.run(coll => coll.updateOne({_id: new ObjectId(uk.IdCidadao), Status: { '$ne': 'C' }}, { $set: {Status}})); 
            return {Status};
        }
        else
        { throw new Error(MESSAGES.Errors.defaults.NOT_FOUND) }
    }

    async search(filter: IFilter){
        return await this.run( async(coll) => {
            const n = filter.Nome ? { Nome: {$regex: `^${filter.Nome}`} } : {};
            const pageSize = 15;  
            
            return (await coll.find(  {...n, Status: { '$ne': 'C' }} )
                             .skip( filter.Page * pageSize )
                             .limit(pageSize)
                             .toArray()
                    ).map(({_id, ...itm})=>({IdCidadao: _id.toString(), ...itm}))
        });
    }
}