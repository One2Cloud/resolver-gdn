import { getSecret } from "./get-secret";

export const setEnvironmentVariable = async () => {
  if (!process.env.SECRET_ARN) throw new Error("SECRET_ARN is not set");
  const vars: { [key: string]: string } = JSON.parse(
    await getSecret(process.env.SECRET_ARN)
  );
  for (const _var in vars) {
    process.env[_var] = vars[_var];
  }
};
