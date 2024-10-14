interface Config {
  backendApiBaseUrl: string;
}

export function getConfig(): Config {
  return {
    backendApiBaseUrl: "http://localhost:3000",
  };
}
