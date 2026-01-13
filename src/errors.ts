export type JokeCloudflareErrorCode = number;

export type JokeCloudflareError = {
  code: JokeCloudflareErrorCode;
  title: string;
  description: string;
  whatHappened?: string;
  whatYouCanDo?: string;
};

export const JOKE_CLOUDFLARE_ERRORS: readonly JokeCloudflareError[] = [
  {
    code: 601,
    title: "Quantum Load Balancer Observed Itself",
    description:
      "The edge load balancer collapsed into a single request-state. The traffic is currently both routed and not routed until someone stops looking at the metrics.",
    whatHappened:
      "A probabilistic routing decision reached 100% uncertainty. This is great for science and terrible for HTTP.",
    whatYouCanDo:
      "Refresh to re-roll the universe. If it persists, gently threaten the load balancer with deterministic math."
  },
  {
    code: 612,
    title: "TLS Handshake Tried to High-Five",
    description:
      "A cryptographic negotiation was attempted, but the server insisted on a secret handshake from 1999 and a wink in Base64.",
    whatHappened:
      "The client offered modern ciphers; the origin replied with interpretive dance and a self-signed haiku.",
    whatYouCanDo:
      "Try again in a moment. If you're the operator, rotate certificates and stop letting the server read vintage forums."
  },
  {
    code: 623,
    title: "Origin Server Developed Stage Fright",
    description:
      "The origin is reachable and healthy, but refuses to respond while being perceived by the public internet.",
    whatHappened:
      "Health checks passed, but the application panicked when it saw a real user-agent.",
    whatYouCanDo:
      "Retry with a calmer browser. If you're the host, add more reassuring logs and tell the origin it's doing great."
  },
  {
    code: 634,
    title: "BGP Announced a Poetry Slam",
    description:
      "A route advertisement arrived wearing berets and refusing to carry packets unless applauded at layer 3.",
    whatHappened:
      "The network briefly preferred the most emotionally resonant path instead of the shortest AS path.",
    whatYouCanDo:
      "Wait for the applause to die down. If you control routing, remove the rhyming communities and re-announce sanity."
  },
  {
    code: 645,
    title: "Cache Evicted the Wrong Timeline",
    description:
      "The edge cache invalidated an alternate reality. Your content is still here, just in a different branch of spacetime.",
    whatHappened:
      "A purge request matched a future key. The cache complied out of courtesy.",
    whatYouCanDo:
      "Hard refresh to align realities. Operators should stop purging with regexes they found on a napkin."
  },
  {
    code: 656,
    title: "WAF Became Self-Aware",
    description:
      "The firewall decided every request is suspicious because 'humans are the real exploit'. It is not wrong, but it is unhelpful.",
    whatHappened:
      "A rule update triggered an existential policy: deny-all, allow-nothing, log-everything, judge-harshly.",
    whatYouCanDo:
      "Try again later. If you're the host, disable the 'paranoia: cosmic' setting and re-enable basic trust."
  },
  {
    code: 667,
    title: "Rate Limiter Hit Its Own Limit",
    description:
      "The rate limiting service received too many rate limit checks and began rate limiting rate limiting.",
    whatHappened:
      "A feedback loop formed. The loop was also rate limited.",
    whatYouCanDo:
      "Wait a moment and retry. Operators should consider limiting the limiter less aggressively. Yes, that sentence happened."
  },
  {
    code: 678,
    title: "HTTP Headers Misfiled in /dev/null",
    description:
      "The request arrived without properly aligned headers. The edge attempted to fold them, but they refused to crease.",
    whatHappened:
      "A proxy inserted a header with negative length. Mathematics disagreed and closed the connection politely.",
    whatYouCanDo:
      "Retry from a different network. Operators: stop editing headers with a text editor and pure confidence."
  },
  {
    code: 689,
    title: "CDN Drift Detected",
    description:
      "The edge nodes have drifted slightly out of phase. Content is present, but it arrives yesterday and leaves tomorrow.",
    whatHappened:
      "Clock skew exceeded the acceptable timeline budget, causing causality-based cache misses.",
    whatYouCanDo:
      "Try again in a few minutes. Operators should synchronize time and stop sourcing NTP from a microwave."
  },
  {
    code: 694,
    title: "Compression Algorithm Got Greedy",
    description:
      "The response was compressed so efficiently it became smaller than zero bytes. The browser refuses to render negative HTML.",
    whatHappened:
      "A rogue Brotli setting attempted to compress whitespace into a singularity.",
    whatYouCanDo:
      "Retry later. Operators should dial back compression from 'ultra' to 'not a black hole'."
  },
  {
    code: 699,
    title: "Edge Router Took a Coffee Break",
    description:
      "Traffic is briefly paused while the edge router reconsiders its life choices and heats water to exactly 92°C.",
    whatHappened:
      "A maintenance daemon scheduled self-care in the middle of peak traffic (bold, misguided).",
    whatYouCanDo:
      "Please try again shortly. Operators should reschedule mindfulness to off-peak and stop deploying on a Tuesday."
  },
  {
    code: 700,
    title: "Protocol Stack Fell Off the Internet",
    description:
      "The networking stack slipped, dropped all its layers, and has rolled under the sofa.",
    whatHappened:
      "An unexpected recursion in the OSI model caused layer 8 to attempt a hotfix.",
    whatYouCanDo:
      "Retry after the layers are retrieved. Operators: firmly re-stack protocols and ban anthropomorphic debugging."
  }
] as const;

export function getJokeCloudflareErrorByCode(
  code: JokeCloudflareErrorCode
): JokeCloudflareError | undefined {
  return JOKE_CLOUDFLARE_ERRORS.find((e) => e.code === code);
}

export function getRandomJokeCloudflareError(seed?: number): JokeCloudflareError {
  // Deterministic-ish if a seed is provided; otherwise use current time.
  const len = JOKE_CLOUDFLARE_ERRORS.length;
  // Normalize seed to a finite integer so modulo produces a valid array index.
  // Note: `typeof NaN === "number"` and `Infinity % len` / `NaN % len` -> NaN.
  const n =
    typeof seed === "number" && Number.isFinite(seed) ? Math.abs(Math.trunc(seed)) : Date.now();
  const idx = n % len;
  return JOKE_CLOUDFLARE_ERRORS[idx]!;
}

