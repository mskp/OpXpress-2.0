import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss Z",
    }),
    printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
  defaultMeta: { service: "user-service" },
  transports: [new transports.Console()],
});

export default logger;
