import {DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: "local", endpoint: "http://localhost:8000"  });

const getTbl = (v:string) => v;

const ddbAdd = async(itm:PutItemCommandInput)=>{
    try{
        itm.TableName = getTbl(itm.TableName);
        await client.send( new PutItemCommand(itm) );
    }
    catch(ex){
        console.log(itm.TableName, ex);
        throw ex;
    }
        
}

const ddbRead = async(itm:GetItemCommandInput)=>{
    itm.TableName = getTbl(itm.TableName);
    const {Item} = await client.send( new GetItemCommand(itm) );
    return Item;
}

const ddbList = async(filter:QueryCommandInput)=>{
    filter.TableName = getTbl(filter.TableName);
    const { Items } = await client.send( new QueryCommand(filter) );
    return Items;
}

const ddbDel = async(itm:DeleteItemCommandInput)=>{
    itm.TableName = getTbl(itm.TableName);
    return await client.send( new DeleteItemCommand(itm) );
}

export { ddbAdd, ddbRead, ddbList, ddbDel }