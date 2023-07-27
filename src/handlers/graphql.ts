import { ApolloServer, gql } from "apollo-server-lambda";
import { buildSubgraphSchema } from '@apollo/subgraph';
import ql from '../schema.graphql'

import { Context } from "../libs/base";
import resolvers from '../resolvers'
import { Cidadao } from "../app/cidadao";
import { SNS } from "../adapters/topic/sns";
import App from 'src/app';
import Cognito from 'src/adapters/identity/cognito';

//------- SETUP APPLICATION CONTEXT -------
const dbCtx = new Context(process.env.MONGO_URL, process.env.MONGO_DB);

const cidadao = new Cidadao(dbCtx);
const topic = new SNS();
const identity = new Cognito('sa-east-1_28VaLNwAP', '7joob4d238qo57i2gdmnkpava2');
const app = new App(dbCtx, cidadao, topic, identity)
//----------------------------------------- 


//--------- SETUP GRAPHQL HANDLER ---------
/********************************************** IMPORTANTE *******************************************************/
const introspection = process.env.STAGE === 'DEV'; // INTERFACE GŔAFICA DO GRAPHQLSERVER DISPONÍVEL SOMENTE EM DEV 
/*****************************************************************************************************************/

const typeDefs = gql(ql) ;
const context = async() =>  ({ dataSources: { app  } })

const srv = new ApolloServer({ context, introspection, schema: buildSubgraphSchema({ typeDefs, resolvers  })});
export const server = srv.createHandler()
//----------------------------------------- 
