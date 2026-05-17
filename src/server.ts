import { createServer, type ServerResponse } from "node:http";
import { studioHtml } from "./studio-page.js";

const HOST = "127.0.0.1";
const PORT = 4317;

function send(res: ServerResponse, statusCode: number, contentType: string, body: string): void {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

export async function startStudioServer(): Promise<void> {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);

    if (url.pathname === "/health") {
      send(res, 200, "application/json; charset=utf-8", JSON.stringify({ ok: true, phase: "1-shell" }));
      return;
    }

    if (url.pathname === "/") {
      send(res, 200, "text/html; charset=utf-8", studioHtml);
      return;
    }

    send(res, 404, "text/plain; charset=utf-8", "Not found");
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, () => {
      server.off("error", reject);
      resolve();
    });
  }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      throw new Error(`Port ${PORT} is already in use. Stop the other process or free the port, then run again.`);
    }

    throw error;
  });

  console.log("Stacksmith Phase 1 local studio shell");
  console.log(`Studio: http://${HOST}:${PORT}`);
  console.log(`Health: http://${HOST}:${PORT}/health`);
  console.log("Blueprint generation, AI providers, databases, and project generation are not implemented yet.");
}
