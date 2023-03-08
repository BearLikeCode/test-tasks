const { createLogger, transports, format, transport } = require("winston");
const { loggerConfig } = require("../config/logger.config");

const errorLogFileName =
  new Date().toLocaleDateString().replace(/\//g, "") + ".error.log";
const logFileName =
  new Date().toLocaleDateString().replace(/\//g, "") + ".all.log";

function createWinstonLogger(label, tags) {
  const transportsList = [new transports.Console()];
  if (!loggerConfig.disableWriteLogs) {
    transportsList.push(
      new transports.File({
        filename: `./logs/all/${logFileName}`,
        json: false,
        maxsize: 5242880,
        maxFiles: 5,
      }),
      new transports.File({
        filename: `./logs/errors/${errorLogFileName}`,
        level: "error",
      })
    );
  }
  return createLogger({
    level: loggerConfig.logLevel,
    format: format.combine(
      format.timestamp(),
      format.combine(
        ...(label
          ? [
              typeof label === "function"
                ? {
                    transform: (info) => {
                      info.label = label();
                      return info;
                    },
                  }
                : format.label({ label }),
            ]
          : []),
        ...(tags
          ? [
              {
                transform: (info) => {
                  info.tags = tags;
                  return info;
                },
              },
            ]
          : []),
        format.metadata(),
        format.errors({ stack: true }),
        ...(!loggerConfig.pretty
          ? [
              format.colorize(),
              format.printf((info) => {
                const l = info.metadata.label;
                let m = info.message;
                if (m instanceof Error) m = m;
                else if (typeof m === "object") m = JSON.stringify(m);
                return `${info.metadata.timestamp} ${info.level} ${
                  l ? `[${l}]` : ""
                } - ${m} ${info.stack ? `\r\n${info.stack}` : ""}`;
              }),
            ]
          : [
              format.printf((info) => {
                const { label: l, timestamp: t } = info.metadata;
                return `[${info.level.toUpperCase()}] [${t}] ${
                  l ? `[${l}]` : ""
                } ${JSON.stringify(info)}`;
              }),
            ])
      )
    ),
    transports: transportsList,
  });
}

class LoggerService {
  wlogger;
  context;
  constructor(context) {
    this.setContext(context);
    this.wlogger = createWinstonLogger(() => this.context);
  }
  error(error, trace, context, _) {
    const pcontext = this.context;
    context ||= error.callerName || pcontext;
    this.setContext(context);
    this.wlogger.error({
      message: error.message,
      label: context,
      error,
    });
    this.setContext(pcontext);
  }
  log(message, context) {
    const pcontext = this.context;
    context ||= (typeof message === "object" && message.callerName) || pcontext;
    this.setContext(context);
    this.wlogger.log("info", message);
    this.setContext(pcontext);
  }
  warn(message, context) {
    const pcontext = this.context;
    context ||= pcontext;
    this.setContext(context);
    this.wlogger.warn(message);
    this.setContext(pcontext);
  }
  debug(message, context) {
    const pcontext = this.context;
    context ||= pcontext;
    this.context = context;
    this.wlogger.debug(message);
    this.setContext(pcontext);
  }
  verbose(message, context) {
    const pcontext = this.context;
    context ||= pcontext;
    this.setContext(context);
    this.wlogger.verbose(message);
    this.setContext(pcontext);
  }
  setContext(context) {
    this.context = context;
  }

  set stream(stream) {
    this.wlogger.stream = stream;
    return this.wlogger.stream;
  }

  get stream() {
    return this.wlogger.stream;
  }
}

const logger = new LoggerService("Application");

module.exports.LoggerService = LoggerService;

module.exports = logger;
