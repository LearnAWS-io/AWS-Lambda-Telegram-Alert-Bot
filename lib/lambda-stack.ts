import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { envSchema } from "./schema";

const { CHAT_ID, TOKEN } = envSchema.parse(process.env);

export class LambdaTelegramAlertBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tgAlertFn = new NodejsFunction(this, "telegram-alert-bot-fn", {
      functionName: "telegram-alert-bot-fn",
      entry: "./lib/telegram-bot-fn.ts",
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        format: OutputFormat.ESM,
      },
      environment: {
        TOKEN,
        CHAT_ID,
      },
    });
  }
}
