const defaultJsonBodyLimit = 1024 * 1024;

export class HttpInputError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
  }
}

export function isAllowedLocalOrigin(origin: string | undefined, allowedPort = "4317"): boolean {
  if (!origin) {
    return true;
  }

  try {
    const url = new URL(origin);
    return (
      (url.hostname === "127.0.0.1" || url.hostname === "localhost" || url.hostname === "[::1]" || url.hostname === "::1") &&
      url.port === allowedPort &&
      (url.protocol === "http:" || url.protocol === "https:")
    );
  } catch {
    return false;
  }
}

export function parseJsonBodyText(body: string, limitBytes = defaultJsonBodyLimit): unknown {
  if (Buffer.byteLength(body, "utf8") > limitBytes) {
    throw new HttpInputError("JSON body is too large.");
  }

  if (!body.trim()) {
    return {};
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new HttpInputError("Malformed JSON body.");
  }
}

export function getDefaultJsonBodyLimit(): number {
  return defaultJsonBodyLimit;
}
