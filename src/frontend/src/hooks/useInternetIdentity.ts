import {
  AuthClient,
  type AuthClientCreateOptions,
  type AuthClientLoginOptions,
} from "@dfinity/auth-client";
import type { Identity } from "@icp-sdk/core/agent";
import { DelegationIdentity, isDelegationValid } from "@icp-sdk/core/identity";
import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadConfig } from "../config";

export type Status =
  | "initializing"
  | "idle"
  | "logging-in"
  | "success"
  | "loginError";

export type InternetIdentityContext = {
  identity?: Identity;
  login: () => void;
  clear: () => void;
  loginStatus: Status;
  isInitializing: boolean;
  isLoginIdle: boolean;
  isLoggingIn: boolean;
  isLoginSuccess: boolean;
  isLoginError: boolean;
  loginError?: Error;
};

const ONE_HOUR_IN_NS = BigInt(3_600_000_000_000);
const II_URL = "https://identity.internetcomputer.org/";

const InternetIdentityReactContext = createContext<
  InternetIdentityContext | undefined
>(undefined);

async function createAuthClient(
  createOptions?: AuthClientCreateOptions,
): Promise<AuthClient> {
  let derivationOrigin: string | undefined;
  try {
    const config = await loadConfig();
    derivationOrigin = config.ii_derivation_origin;
  } catch {
    /* no config, safe to continue */
  }
  return AuthClient.create({
    idleOptions: {
      disableDefaultIdleCallback: true,
      disableIdle: true,
      ...createOptions?.idleOptions,
    },
    loginOptions: { derivationOrigin },
    ...createOptions,
  });
}

function assertProviderPresent(
  ctx: InternetIdentityContext | undefined,
): asserts ctx is InternetIdentityContext {
  if (!ctx) throw new Error("InternetIdentityProvider is not present.");
}

export const useInternetIdentity = (): InternetIdentityContext => {
  const ctx = useContext(InternetIdentityReactContext);
  assertProviderPresent(ctx);
  return ctx;
};

export function InternetIdentityProvider({
  children,
  createOptions,
}: PropsWithChildren<{
  children: ReactNode;
  createOptions?: AuthClientCreateOptions;
}>) {
  const [authClient, setAuthClient] = useState<AuthClient | undefined>(
    undefined,
  );
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [loginStatus, setStatus] = useState<Status>("initializing");
  const [loginError, setError] = useState<Error | undefined>(undefined);

  const setErrorMessage = useCallback((msg: string) => {
    setStatus("loginError");
    setError(new Error(msg));
  }, []);

  const handleLoginSuccess = useCallback(() => {
    const id = authClient?.getIdentity();
    if (!id) {
      setErrorMessage("Identity not found after login");
      return;
    }
    setIdentity(id);
    setStatus("success");
  }, [authClient, setErrorMessage]);

  const handleLoginError = useCallback(
    (maybeError?: string) => setErrorMessage(maybeError ?? "Login failed"),
    [setErrorMessage],
  );

  const login = useCallback(() => {
    if (!authClient) {
      setErrorMessage("AuthClient not ready");
      return;
    }
    const cur = authClient.getIdentity();
    if (
      !cur.getPrincipal().isAnonymous() &&
      cur instanceof DelegationIdentity &&
      isDelegationValid(cur.getDelegation())
    ) {
      setErrorMessage("Already authenticated");
      return;
    }
    setStatus("logging-in");
    void authClient.login({
      identityProvider: II_URL,
      onSuccess: handleLoginSuccess,
      onError: handleLoginError,
      maxTimeToLive: ONE_HOUR_IN_NS * BigInt(24 * 30),
    } as AuthClientLoginOptions);
  }, [authClient, handleLoginError, handleLoginSuccess, setErrorMessage]);

  const clear = useCallback(() => {
    if (!authClient) {
      setErrorMessage("Auth client not initialized");
      return;
    }
    void authClient
      .logout()
      .then(() => {
        setIdentity(undefined);
        setAuthClient(undefined);
        setStatus("idle");
        setError(undefined);
      })
      .catch((err: unknown) => {
        setStatus("loginError");
        setError(err instanceof Error ? err : new Error("Logout failed"));
      });
  }, [authClient, setErrorMessage]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setStatus("initializing");
        const client = await createAuthClient(createOptions);
        if (cancelled) return;
        setAuthClient(client);
        if (await client.isAuthenticated()) {
          if (!cancelled) setIdentity(client.getIdentity());
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("loginError");
          setError(err instanceof Error ? err : new Error("Init failed"));
        }
      } finally {
        if (!cancelled) setStatus("idle");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [createOptions]);

  const value = useMemo<InternetIdentityContext>(
    () => ({
      identity,
      login,
      clear,
      loginStatus,
      isInitializing: loginStatus === "initializing",
      isLoginIdle: loginStatus === "idle",
      isLoggingIn: loginStatus === "logging-in",
      isLoginSuccess: loginStatus === "success",
      isLoginError: loginStatus === "loginError",
      loginError,
    }),
    [identity, login, clear, loginStatus, loginError],
  );

  return createElement(InternetIdentityReactContext.Provider, {
    value,
    children,
  });
}
