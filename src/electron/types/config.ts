import applicationOptionsSchema from "../schema/applicationOptions.js";
import startUpOptionsSchema from "../schema/startUpOptions.js";

type InferTypeFromOptionsSchema<T> = {
  [K in keyof T]: T[K] extends { type: "boolean" }
    ? boolean
    : T[K] extends { type: "string"; choices: readonly (infer U)[] }
      ? U
      : T[K] extends { type: "string" }
        ? string
        : T[K] extends { type: "array"; default: infer U } // Handle arrays
          ? U
          : undefined;
};

type ApplicationConfig = typeof applicationOptionsSchema;
type StartUpConfig = typeof startUpOptionsSchema;

// Used during application start-up
export type StartUpConfigType = InferTypeFromOptionsSchema<StartUpConfig>;

// Used after start-up,
// includes ApplicationConfig & StartUpConfig & some additional fields
export type ConfigType = InferTypeFromOptionsSchema<
  ApplicationConfig & StartUpConfig
> & {
  configFileExists: boolean;
  error: string | null;
};
