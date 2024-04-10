import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import axios from "axios";

let _get_secret_cache: string | undefined = undefined;

export async function getSecret(secretArn: string): Promise<string> {
  if (_get_secret_cache) return _get_secret_cache;
  const client = new SecretsManager({
    region: process.env.AWS_REGION || "us-east-1",
  });
  const response = await client.getSecretValue({ SecretId: secretArn });
  if (!response.SecretString) throw new Error("Secret value is empty");
  _get_secret_cache = response.SecretString;
  return _get_secret_cache;
}

export async function getSecretInLambda(secretArn: string): Promise<string> {
  const response = await axios.get(`http://localhost:${process.env.PARAMETERS_SECRETS_EXTENSION_HTTP_PORT || 2773}/secretsmanager/get?secretId=${secretArn}`, {
    headers: {
      "X-Aws-Parameters-Secrets-Token": `${process.env.AWS_SESSION_TOKEN}`,
    },
  });
  return response.data.SecretString;
}
