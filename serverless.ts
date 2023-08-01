import type { AWS } from '@serverless/typescript';
import {graphqlHandler, authMiddleware} from './src/index'

const args = (key:string, defaultValue:string) =>  {
  const idx = process.argv.findIndex(f=>f.startsWith(`--${key}`))
  if(idx<0)
  { return defaultValue }
  else
  {
    const arg = process.argv[idx].split('=')
    return (arg.length == 2) ? arg[1] : process.argv[idx+1]
  }
}

const accountId = 813397945060;
const service   = {alias: "CID", name: 'Cidadao' }
const stage     =  args('stage', 'dev').toUpperCase();
const region    = "sa-east-1";
const mongoServers = {
  DEV: 'mongodb://mongoadmin:secret@db/', 
  HMG: 'mongodb+srv://suitapp:ymwwXjD4KeFHvg8W@suitapp.dlmxxtl.mongodb.net/?retryWrites=true&w=majority', 
  PRD: 'mongodb+srv://suitapp:ymwwXjD4KeFHvg8W@suitapp.dlmxxtl.mongodb.net/?retryWrites=true&w=majority'
}

const topics = {
  cidadao: {key: 'topMulta', name: `${service.alias}_CIDADAO_TOP_${stage}`},
};

const serverlessConfiguration: AWS = {
  service: service.name,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    region,
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      MONGO_URL: mongoServers[stage],
      MONGO_DB: `${service.alias}_CIDADAO_${stage}`,
      STAGE: stage,
      TOPIC_CIDADAO: `arn:aws:sns:${region}:${accountId}:${topics.cidadao.name}`,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam:{
      role:{
        statements:[
          {
            Effect: "Allow", 
            Action: [
              "sns:Publish",
              "sns:Subscribe",
              "sns:GetTopicAttributes",
            ],
            Resource: Object.keys(topics).map( k => `arn:aws:sns:${region}:${accountId}:${topics[k].name}`) 
          },
          { 
            Effect: "Allow",
            Action: ["ses:*"],
            Resource: ["arn:aws:ses:*:" + accountId + ":*"]
         },
         { 
          Effect: "Allow",
          Action: ["cognito-idp:AdminCreateUser"],
          Resource: [`arn:aws:cognito-idp:${region}:${accountId}:*`]
       }
        ]
      }
    }
  },
  // import the function via paths
  functions: { graphqlHandler, authMiddleware },
  package:   { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      loader: {'.graphql': 'text'},
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources:{
    Resources: {
      [topics.cidadao.key]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: topics.cidadao.name
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
