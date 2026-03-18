import { useMemo, useState } from "react";
import { CloudflareErrorPage, getRandomJokeCloudflareError } from "../index";

export function App() {
  const demoMode = import.meta.env.VITE_ITS_CLOUDFLARE_BRO_DEMO === "true";
  const [seed, setSeed] = useState(() => Date.now());
  const error = useMemo(() => getRandomJokeCloudflareError(seed), [seed]);

  return (
    <div>
      {demoMode && (
        <div className="fixed left-4 top-4 z-10 rounded-md border border-gray-200 bg-white/90 p-3 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-gray-800">Demo controls</div>
          <div className="mt-2 flex items-center gap-2">
            <button
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
              onClick={() => setSeed(Date.now())}
            >
              New fake outage
            </button>
            <div className="text-xs text-gray-600">
              Showing <span className="font-mono">{error.code}</span>
            </div>
          </div>
        </div>
      )}

      <CloudflareErrorPage error={error} host="edge-of-reason.invalid" />
    </div>
  );
}

