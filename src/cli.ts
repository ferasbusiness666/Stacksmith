#!/usr/bin/env node

import { startStudioServer } from "./server.js";

const command = process.argv[2];

function printHelp(): void {
  console.log(`Stacksmith

Usage:
  stacksmith studio

Commands:
  studio   Start the Phase 1 local studio shell
`);
}

async function main(): Promise<void> {
  if (command === "studio") {
    await startStudioServer();
    return;
  }

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Stacksmith failed to start: ${message}`);
  process.exitCode = 1;
});
