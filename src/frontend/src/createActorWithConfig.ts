import { HttpAgent } from "@icp-sdk/core/agent";
// Only loaded when a real ICP canister ID is available.
import {
  type CreateActorOptions,
  ExternalBlob,
  type backendInterface,
  createActor,
} from "./backend";
import { loadConfig } from "./config";
import { StorageClient } from "./utils/StorageClient";

function extractAgentErrorMessage(error: string): string {
  const str = String(error);
  const match = str.match(/with message:\s*'([^']+)'/s);
  return match ? match[1] : str;
}

function processError(e: unknown): never {
  if (e && typeof e === "object" && "message" in e) {
    throw new Error(
      extractAgentErrorMessage(`${(e as { message: string }).message}`),
    );
  }
  throw e;
}

export async function createActorWithConfig(
  options?: CreateActorOptions,
): Promise<backendInterface> {
  const config = await loadConfig();
  const agent = new HttpAgent({
    ...options?.agentOptions,
    host: config.backend_host,
  });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(console.error);
  }
  const storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id!,
    config.project_id,
    agent,
  );
  const SENTINEL = "!caf!";
  const uploadFile = async (file: ExternalBlob): Promise<Uint8Array> => {
    const { hash } = await storageClient.putFile(
      await file.getBytes(),
      file.onProgress,
    );
    return new TextEncoder().encode(SENTINEL + hash);
  };
  const downloadFile = async (bytes: Uint8Array): Promise<ExternalBlob> => {
    const hash = new TextDecoder().decode(bytes).substring(SENTINEL.length);
    const url = await storageClient.getDirectURL(hash);
    return ExternalBlob.fromURL(url);
  };
  return createActor(config.backend_canister_id!, uploadFile, downloadFile, {
    ...options,
    agent,
    processError,
  });
}
