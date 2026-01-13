import * as React from "react";
import type { JokeCloudflareError } from "../errors";
import { getJokeCloudflareErrorByCode, getRandomJokeCloudflareError } from "../errors";

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

function randomHex(len: number): string {
  const alphabet = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function defaultHost(): string {
  try {
    // eslint-disable-next-line no-restricted-globals
    if (typeof window !== "undefined" && window.location?.hostname) return window.location.hostname;
  } catch {
    // ignore
  }
  return "this-is-a-joke.dontsueme.com";
}

function IconBrowserOk() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden="true">
      <rect x="12" y="18" width="72" height="60" rx="8" fill="#e5e7eb" />
      <rect x="12" y="18" width="72" height="14" rx="8" fill="#d1d5db" />
      <circle cx="22" cy="25" r="3" fill="#9ca3af" />
      <circle cx="32" cy="25" r="3" fill="#9ca3af" />
      <circle cx="42" cy="25" r="3" fill="#9ca3af" />
      <circle cx="34" cy="56" r="14" fill="#84cc16" />
      <path
        d="M27 56l5 6 10-14"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCloudBad() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden="true">
      <path
        d="M34 68h36c10 0 18-8 18-18s-8-18-18-18c-1 0-2 0-3 .2C64 23 55 16 44 16c-12 0-22 9-23 21C12 39 6 46 6 55c0 7 6 13 13 13h15z"
        fill="#9ca3af"
      />
      <circle cx="48" cy="52" r="14" fill="#ef4444" />
      <path
        d="M42 46l12 12M54 46L42 58"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHostOk() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden="true">
      <rect x="18" y="18" width="60" height="60" rx="10" fill="#e5e7eb" />
      <rect x="26" y="28" width="44" height="10" rx="5" fill="#d1d5db" />
      <rect x="26" y="44" width="44" height="10" rx="5" fill="#d1d5db" />
      <rect x="26" y="60" width="44" height="10" rx="5" fill="#d1d5db" />
      <circle cx="64" cy="60" r="14" fill="#84cc16" />
      <path
        d="M57 60l5 6 10-14"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloudflareErrorPage(props: CloudflareErrorPageProps) {
  const {
    error,
    code,
    rayId,
    colo = "Paris",
    host = defaultHost(),
    visitorIp = "203.0.113.13",
    timestamp = new Date(),
    hideFooter,
    className
  } = props;

  const resolvedError = React.useMemo(() => {
    if (error) return error;
    if (typeof code === "number") return getJokeCloudflareErrorByCode(code) ?? getRandomJokeCloudflareError(code);
    return getRandomJokeCloudflareError();
  }, [code, error]);

  const stableRayId = React.useMemo(() => {
    if (rayId) return rayId;
    // Cloudflare-ish Ray ID vibe: 16-hex + 4-hex suffix.
    return `${randomHex(16)}-${randomHex(4)}`;
  }, [rayId]);

  return (
    <main className={["min-h-screen bg-white text-gray-800", className].filter(Boolean).join(" ")}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 md:gap-4 items-start md:items-baseline">
            <h1 className="text-5xl font-light tracking-tight text-gray-700">
              Error <span className="font-normal">{resolvedError.code}</span>
            </h1>
            <p className="text-lg font-light text-gray-500">{resolvedError.title}</p>
          </div>
          <p className="text-sm text-gray-500">
            Ray ID: <span className="font-mono text-gray-700">{stableRayId}</span> •{" "}
            <span className="font-mono">{formatUtc(timestamp)}</span>
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
              <div className="mt-3 text-sm text-gray-600">{host}</div>
              <div className="mt-2 text-xl font-light text-gray-700">Host</div>
              <div className="text-xl font-semibold text-lime-600">Working</div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-8 py-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="text-2xl font-light text-gray-800">What happened?</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {resolvedError.whatHappened ?? resolvedError.description}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-800">What can I do?</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {resolvedError.whatYouCanDo ??
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

