export function isPlatform(platform: NodeJS.Platform) {
  if (process.platform === platform) return true;

  return false;
}

export function isArch(arch: NodeJS.Architecture) {
  if (process.arch === arch) return true;

  return false;
}
