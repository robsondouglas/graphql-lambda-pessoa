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

    public run = async (tableName: string, hnd: (coll:Collection) => Promise<any>) => await hnd(this.client.db(this.databaseName).collection(tableName));
    
    private static counter = 0;
    public async transaction<T>(dlg:()=>Promise<T>):Promise<T>{
        
        await new Promise<void>(async(resolve, reject) =>{
            try{
                if(Context.counter == 0){
                    console.log("Conectando...")
                    await this.client.connect();
                    Context.counter++
                }
                resolve();
            }
            catch(ex){ reject(ex) }
        });

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
            await new Promise<void>(async(resolve, reject) =>{
                try{
                    Context.counter--;
                    if(Context.counter == 0)
                    {
                        await this.client.close() 
                        console.log("Deconectado!")
                    }
                    resolve();
                }
                catch(ex){ reject(ex) }
            });
        }
    }

}

export abstract class Base{
    
    constructor(protected tableName: string, private context:Context){
    }

    protected run = async (hnd: (coll:Collection) => Promise<any>) => await this.context.run(this.tableName, hnd);  
}