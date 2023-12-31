import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import ITopic, { ActionType } from "./models";

export class SNS implements ITopic {
    private client = new SNSClient({region: 'sa-east-1'});
        
    async publish(topicName: string, action:ActionType, data: any): Promise<void> {
        console.log('Sending event', topicName, action)
        const command = new PublishCommand({ 
            TopicArn: topicName,
            Message: JSON.stringify(data),
            MessageAttributes: { // MessageAttributeMap
                "ACTION": { 
                    DataType: "String", 
                    StringValue: action
                },
            }, 
        });
        await this.client.send(command);
    }
}
