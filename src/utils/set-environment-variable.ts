import { getSecret } from "./get-secret";

export const setEnvironmentVariable = async () => {
  if (process.env.SECRET_ARN) {
    const vars: { [key: string]: string } = JSON.parse(await getSecret(process.env.SECRET_ARN));
    for (const _var in vars) {
      process.env[_var] = vars[_var];
    }
  } else {
    console.warn("SECRET_ARN is not set");
  }
};
