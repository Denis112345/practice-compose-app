export function requireEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required env ${name}`);
  }

  return value;
}

export function requireNumberEnv(name: string) {
  const value = Number(requireEnv(name));

  if (!Number.isFinite(value)) {
    throw new Error(`Env ${name} must be a number`);
  }

  return value;
}

