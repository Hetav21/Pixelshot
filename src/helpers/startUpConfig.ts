import { app } from "electron";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import applicationOptionsSchema from "../schema/applicationOptions.js";
import startUpOptionsSchema from "../schema/startUpOptions.js";
import type { ConfigType } from "../types/config.js";

export function getStartUpConfigFromCommandLine() {
  const config = yargs(hideBin(process.argv))
    .help()
    .version(app.getVersion())
    .completion()
    .options({
      ...applicationOptionsSchema,
      ...startUpOptionsSchema,
    })
    .parse();

  return config as unknown as ConfigType;
}
