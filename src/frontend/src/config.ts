// Simplified config — works on both Caffeine (ICP) and Vercel.
// When env.json is absent (Vercel), backend is disabled and UI uses local fallback data.

export interface Config {
  backend_canister_id: string | null;
  storage_gateway_url: string;
  bucket_name: string;
  project_id: string;
  ii_derivation_origin?: string;
  backend_host?: string;
}

const NOOP_CONFIG: Config = {
  backend_canister_id: null,
  storage_gateway_url: "https://blob.caffeine.ai",
  bucket_name: "default-bucket",
  project_id: "00000000-0000-0000-0000-000000000000",
};

let configCache: Config | null = null;

export async function loadConfig(): Promise<Config> {
  if (configCache) return configCache;
  try {
    const res = await fetch("/env.json");
    if (!res.ok) throw new Error("env.json not found");
    const json = await res.json();
    configCache = {
      backend_host: json.backend_host === "undefined" ? undefined : json.backend_host,
      backend_canister_id:
        json.backend_canister_id === "undefined" ? null : json.backend_canister_id,
      storage_gateway_url: json.storage_gateway_url ?? "https://blob.caffeine.ai",
      bucket_name: json.bucket_name ?? "default-bucket",
      project_id: json.project_id !== "undefined" ? json.project_id : "00000000-0000-0000-0000-000000000000",
      ii_derivation_origin:
        json.ii_derivation_origin === "undefined" ? undefined : json.ii_derivation_origin,
    };
    return configCache;
  } catch {
    configCache = NOOP_CONFIG;
    return configCache;
  }
}
