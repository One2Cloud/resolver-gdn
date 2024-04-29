import { getSecret } from "./get-secret";

export const setEnvironmentVariable = async () => {
  if (process.env.GLOBAL_SECRET_ARN) {
    const vars: { [key: string]: string } = JSON.parse(await getSecret(process.env.GLOBAL_SECRET_ARN));
    for (const _var in vars) {
      process.env[_var] = vars[_var];
    }
  }
};
