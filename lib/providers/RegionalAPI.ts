import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

import path = require("path");

interface IConstructProps {
  secret: secretsmanager.Secret;
  queue: sqs.Queue;
}

export class RegionalAPI extends Construct {
  public readonly service: apprunner.Service;

  constructor(scope: Construct, id: string, props: IConstructProps) {
    super(scope, id);

    new cdk.CfnOutput(this, "SecretName", { value: props.secret.secretName });

    const secret = secretsmanager.Secret.fromSecretCompleteArn(
      this,
      "Secret",
      `arn:aws:secretsmanager:${cdk.Stack.of(this).region}:${
        cdk.Stack.of(this).account
      }:secret:resolver-gdn-secret-ROby3i`
    );

    const image = new ecra.DockerImageAsset(this, "Image", {
      directory: path.join(process.cwd(), "src"),
      file: "docker/Dockerfile",
      platform: ecra.Platform.LINUX_AMD64,
    });

    this.service = new apprunner.Service(this, "Service", {
      // serviceName: "resolver-gdn-api",
      source: apprunner.Source.fromEcr({
        repository: image.repository,
        tagOrDigest: image.imageTag,
        imageConfiguration: {
          port: 8080,
          environmentSecrets: {
            REDIS_URL: apprunner.Secret.fromSecretsManager(secret, "REDIS_URL"),
            GETBLOCK_CONFIG: apprunner.Secret.fromSecretsManager(
              secret,
              "GETBLOCK_CONFIG"
            ),
            GROVE_CITY_APP_ID: apprunner.Secret.fromSecretsManager(
              secret,
              "GROVE_CITY_APP_ID"
            ),
            SUBGRAPH_URL: apprunner.Secret.fromSecretsManager(
              secret,
              "SUBGRAPH_URL"
            ),
          },
          environmentVariables: {
            EVENT_HANDLER_SQS_QUEUE_URL: props.queue.queueUrl,
          },
          startCommand: "node /app/app/api/index.js",
        },
      }),
      cpu: apprunner.Cpu.QUARTER_VCPU,
      memory: apprunner.Memory.HALF_GB,
    });
    secret.grantRead(this.service);
    props.queue.grantSendMessages(this.service);

    new cdk.CfnOutput(this, "ServiceURL", { value: this.service.serviceUrl });
  }
}
