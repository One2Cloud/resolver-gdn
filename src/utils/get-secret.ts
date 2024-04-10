import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import axios from "axios";

export async function getSecret(secretArn: string): Promise<string> {
  const client = new SecretsManager({
    region: process.env.AWS_REGION || "us-east-1",
  });
  const response = await client.getSecretValue({ SecretId: secretArn });
  if (!response.SecretString) throw new Error("Secret value is empty");
  return response.SecretString;
}

export async function getSecretInLambda(secretArn: string): Promise<string> {
  const response = await axios.get<string>(`http://localhost:${process.env.PARAMETERS_SECRETS_EXTENSION_HTTP_PORT || 2773}/secretsmanager/get?secretId=${secretArn}`, {
    headers: {
      "X-Aws-Parameters-Secrets-Token": `${process.env.AWS_SESSION_TOKEN}`,
    },
  });
  const data = JSON.parse(response.data);
  if (!data.SecretString) throw new Error("Secret value is empty");
  return data.SecretString;
}
