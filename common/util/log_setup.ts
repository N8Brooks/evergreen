// This file is meant to be imported solely for its side effects

import { log } from "../deps.ts";

await log.setup({
  handlers: {
    default: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["default"],
    },
  },
});
