import winston from "winston";

const format = winston.format.printf(({ level, timestamp, message, ...meta }) => {
  if (!!meta.class) {
    return `${timestamp} ${level}: [${meta.class}] ${message}`;
  } else {
    return `${timestamp} ${level}: ${message}`;
  }
});

class Logger {
  private _logger = winston.createLogger({
    level: "info",
    defaultMeta: { service: "@amazing-race/service" },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), format),
      }),
    ],
  });

  public info(message: string, clazz?: any) {
    this._logger.info(message, {
      class: clazz?.constructor?.name,
    });
  }

  public warn(message: string, clazz?: any) {
    this._logger.warn(message, {
      class: clazz?.constructor?.name,
    });
  }

  public error(message: string, e?: Error, clazz?: any) {
    this._logger.error(message, {
      errorObject: e,
      class: clazz?.constructor?.name,
    });
  }
}

export { Logger };
