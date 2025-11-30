import 'dotenv/config';

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Env variable ${name} is missing`);
  }
  return value;
}
