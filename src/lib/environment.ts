const _ENVIRONMENTS = ["dev", "prod", "test", "debug"] as const;
export type Env = (typeof _ENVIRONMENTS)[number];

// Fallback to 'prod' if no environment is set
let currentEnv: Env = process.env.NODE_ENV as Env;
if (!_ENVIRONMENTS.includes(currentEnv)) {
  currentEnv = "prod";
}

export function getEnv(): Env {
  return currentEnv;
}

export function setEnv(newEnv: Env): void {
  if (_ENVIRONMENTS.includes(newEnv)) {
    currentEnv = newEnv;
  }
}

export function isEnv(...env: Env[] | [Env]): boolean {
  return Array.isArray(env[0])
    ? env[0].includes(currentEnv)
    : env.includes(currentEnv);
}
