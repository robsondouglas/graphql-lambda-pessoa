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

    
    public run = (tableName: string, hnd: (coll:Collection) => Promise<any>) => hnd(this.client.db(this.databaseName).collection(tableName));
    
    public async transaction<T>(dlg:()=>Promise<T>):Promise<T>{
        await this.client.connect();
        try
        { return await dlg() }
        finally
        { await this.client.close() }
    }

}

export abstract class Base{
    
    constructor(protected tableName: string, private context:Context){
    }

    protected run = (hnd: (coll:Collection) => Promise<any>) => this.context.run(this.tableName, hnd);  
}