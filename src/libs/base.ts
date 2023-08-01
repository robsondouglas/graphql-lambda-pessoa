import { Collection, MongoClient, ServerApiVersion } from "mongodb";


export class Context{
    protected client : MongoClient; 
    
    constructor(databaseUrl:string, private databaseName:string){
        this.client = new MongoClient(databaseUrl, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }

    
    public run = async (tableName: string, hnd: (coll:Collection) => Promise<any>) => {
        try{
            console.log('Running...')
            const res = await hnd(this.client.db(this.databaseName).collection(tableName))
            console.log('OK')
            return res;
        }
        catch(ex)
        { 
            console.log('Erro...') 
            throw ex;
        }
    };
    
    public async transaction<T>(dlg:()=>Promise<T>):Promise<T>{
        console.log("Conectando...")
        await this.client.connect();
        try
        { 
            console.log("Conectado!")        
            return await dlg() 
        }
        catch(ex){
            console.error('ERRO ::: ', ex);
            throw ex;
        }
        finally
        { 
            await this.client.close() 
            console.log("Deconectado!")
        }
    }

}

export abstract class Base{
    
    constructor(protected tableName: string, private context:Context){
    }

    protected run = async (hnd: (coll:Collection) => Promise<any>) => await this.context.run(this.tableName, hnd);  
}