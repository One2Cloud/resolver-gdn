import winston from "winston";

export function createLogger(defaultMeta?: { [key: string]: string }) {
  const transports: winston.transport[] = [new winston.transports.Console()];
  return winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    defaultMeta: { ...defaultMeta },
    transports: [...transports],
  });
}
