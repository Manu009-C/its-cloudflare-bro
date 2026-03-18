import { useEffect, useId, useMemo, useState } from "react";
import type { JokeCloudflareError } from "../errors";
import { getJokeCloudflareErrorByCode, getRandomJokeCloudflareError } from "../errors";
import { IconBrowserOk, IconCloudBad, IconHostOk } from "./icons";

export type CloudflareErrorPageProps = {
  /**
   * Choose an error by numeric code (600-700-ish). If not found, a random joke error is used.
   */
  code?: number;
  /**
   * Provide a full error object. Takes precedence over `code`.
   */
  error?: JokeCloudflareError;
  /**
   * Override the "Ray ID" shown on the page.
   */
  rayId?: string;
  /**
   * Override the datacenter/city label.
   */
  colo?: string;
  /**
   * Override the host label shown in the right column.
   */
  host?: string;
  /**
   * Override the visitor IP shown in the footer. Defaults to a TEST-NET address.
   */
  visitorIp?: string;
  /**
   * Override timestamp shown in the header (UTC).
   */
  timestamp?: Date;
  /**
   * If true, hides the footer line (Ray ID / IP / attribution).
   */
  hideFooter?: boolean;
  /**
   * Optional className for the root container.
   */
  className?: string;
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatUtc(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = pad2(d.getUTCMonth() + 1);
  const dd = pad2(d.getUTCDate());
  const hh = pad2(d.getUTCHours());
  const mi = pad2(d.getUTCMinutes());
  const ss = pad2(d.getUTCSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss} UTC`;
}

function fnv1a32(input: string): number {
  // Small, deterministic string hash (stable across SSR + hydration).
  // https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  // Simple seeded PRNG with decent distribution for UI "randomness".
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexFromSeed(seed: number, len: number): string {
  const rnd = mulberry32(seed);
  const alphabet = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(rnd() * alphabet.length)]!;
  return out;
}

function defaultHostFallback(): string {
  // IMPORTANT: SSR-safe fallback; do not read `window` during render.
  return "this-is-a-joke.dontsueme.com";
}

export const CloudflareErrorPage = (props: CloudflareErrorPageProps) => {
  const reactId = useId();
  const seed = useMemo(() => fnv1a32(reactId), [reactId]);

  const {
    error,
    code,
    rayId,
    colo = "Italy",
    host,
    visitorIp = "203.0.113.13",
    timestamp,
    hideFooter,
    className
  } = props;

  // Avoid SSR/hydration mismatches: don't read `window.location.hostname` during render.
  // If `host` isn't provided, we render a stable fallback on both SSR and first client render,
  // then "upgrade" to the real hostname after mount.
  const [resolvedHost, setResolvedHost] = useState<string>(() => host ?? defaultHostFallback());
  useEffect(() => {
    if (host) {
      setResolvedHost(host);
      return;
    }
    try {
      // eslint-disable-next-line no-restricted-globals
      if (typeof window !== "undefined" && window.location?.hostname) setResolvedHost(window.location.hostname);
    } catch {
      // ignore
    }
  }, [host]);

  // Same SSR/hydration principle for timestamps: default to a stable placeholder, then set
  // an actual timestamp after mount if none was provided.
  const [resolvedTimestamp, setResolvedTimestamp] = useState<Date | null>(() => timestamp ?? null);
  useEffect(() => {
    if (timestamp) {
      setResolvedTimestamp(timestamp);
      return;
    }
    setResolvedTimestamp((prev) => prev ?? new Date());
  }, [timestamp]);

  const resolvedError = useMemo(() => {
    if (error) return error;
    if (typeof code === "number") return getJokeCloudflareErrorByCode(code) ?? getRandomJokeCloudflareError(code);
    // Deterministic "random" error to avoid SSR/hydration mismatch when no code/seed is provided.
    return getRandomJokeCloudflareError(seed);
  }, [code, error, seed]);

  // Defensive fallback: even if a caller passes a pathological `code` (NaN/Infinity/float),
  // we should never crash during render.
  const safeError = resolvedError ?? getRandomJokeCloudflareError(seed);

  const stableRayId = useMemo(() => {
    if (rayId) return rayId;
    // Cloudflare-ish Ray ID vibe: 16-hex + 4-hex suffix.
    // Must be deterministic across SSR + hydration.
    const main = hexFromSeed(seed ^ 0xa5a5a5a5, 16);
    const suffix = hexFromSeed(seed ^ 0x5a5a5a5a, 4);
    return `${main}-${suffix}`;
  }, [rayId, seed]);

  return (
    <main className={["min-h-screen bg-white text-gray-800", className].filter(Boolean).join(" ")}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 md:gap-4 items-start md:items-baseline">
            <h1 className="text-5xl font-light tracking-tight text-gray-700">
              Error <span className="font-normal">{safeError.code}</span>
            </h1>
            <p className="text-lg font-light text-gray-500">{safeError.title}</p>
          </div>
          <p className="text-sm text-gray-500">
            Ray ID: <span className="font-mono text-gray-700">{stableRayId}</span> •{" "}
            <span className="font-mono">{resolvedTimestamp ? formatUtc(resolvedTimestamp) : "—"}</span>
          </p>
        </div>

        <div className="mt-10 rounded-sm border border-gray-200 bg-gray-50 shadow-sm">
          <div className="grid grid-cols-1 gap-10 px-8 py-10 md:grid-cols-3 md:gap-6">
            <div className="flex flex-col items-center text-center">
              <IconBrowserOk />
              <div className="mt-3 text-sm text-gray-600">You</div>
              <div className="mt-2 text-xl font-light text-gray-700">Browser</div>
              <div className="text-xl font-semibold text-lime-600">Working</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <IconCloudBad />
              <div className="mt-3 text-sm text-gray-600">{colo}</div>
              <div className="mt-2 text-xl font-light text-gray-700">Cloud</div>
              <div className="text-xl font-semibold text-red-600">Error</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <IconHostOk />
              <div className="mt-3 text-sm text-gray-600">{resolvedHost}</div>
              <div className="mt-2 text-xl font-light text-gray-700">Host</div>
              <div className="text-xl font-semibold text-lime-600">Working</div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-8 py-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="text-2xl font-light text-gray-800">What happened?</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {safeError.whatHappened ?? safeError.description}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-800">What can I do?</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {safeError.whatYouCanDo ??
                    "Try again in a few minutes. If you are the host, perform a ritual restart and offer the logs a small sacrifice."}
                </p>
              </div>
            </div>
          </div>

          {!hideFooter && (
            <div className="border-t border-gray-200 px-8 py-5 text-center text-xs text-gray-500">
              <span className="font-semibold text-gray-600">Ray ID:</span>{" "}
              <span className="font-mono">{stableRayId}</span> • <span className="font-semibold">Your IP:</span>{" "}
              <span className="font-mono">{visitorIp}</span> • Performance &amp; security by{" "}
              <a
                href="https://github.com/Manu009-C/its-cloudflare-bro"
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-gray-800"
              >
                Cloud-Man-U
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

