import { ApolloServer, gql } from "apollo-server-lambda";
import { buildSubgraphSchema } from '@apollo/subgraph';
import ql from '../schema.graphql'

import { Context } from "../libs/base";
import resolvers from '../resolvers'
import { Cidadao } from "../app/cidadao";
import { SNS } from "../adapters/topic/sns";
import App from 'src/app';
import Cognito from 'src/adapters/identity/cognito';
import { default as TopickMocked } from "src/adapters/topic/mocked";
import { default as IdentityMocked } from "src/adapters/identity/mocked";

const DEV_MODE = process.env.STAGE === 'DEV'

//------- SETUP APPLICATION CONTEXT -------
const dbCtx = new Context(process.env.MONGO_URL, process.env.MONGO_DB);

const cidadao = new Cidadao(dbCtx);
const topic = DEV_MODE ? new TopickMocked() : new SNS();
const identity = DEV_MODE ? new IdentityMocked() : new Cognito([`https://cognito-idp.sa-east-1.amazonaws.com/${process.env.cognitoPoolId}`]);
const app = new App(dbCtx, cidadao, topic, identity)
//----------------------------------------- 


//--------- SETUP GRAPHQL HANDLER ---------
/********************************************** IMPORTANTE *******************************************************/
const introspection = DEV_MODE; // INTERFACE GŔAFICA DO GRAPHQLSERVER DISPONÍVEL SOMENTE EM DEV 
/*****************************************************************************************************************/

if(DEV_MODE)
{ console.log("RODANDO EM MODO DE DESENVOLVIMENTO!!!!") }

const typeDefs = gql(ql);
const context = async({event}) =>  { 
    const [_, data] = event.headers?.authorization?.split(' ').at(1)?.split('.') || [];
    const claims = data ? JSON.parse( Buffer.from(data, 'base64').toString('ascii') ) : {};
       
    return ({ claims, dataSources: { app  } })
}
const srv = new ApolloServer({ context, introspection, schema: buildSubgraphSchema({ typeDefs, resolvers }) });
export const server = srv.createHandler()
//----------------------------------------- 