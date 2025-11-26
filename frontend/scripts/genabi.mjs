import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const contractsDeploymentsRoot =
  process.env.CONTRACTS_DEPLOYMENTS_ROOT ||
  path.resolve(__dirname, "../../contracts/deployments");

async function main() {
  const abiDir = path.resolve(__dirname, "../abi");
  await mkdir(abiDir, { recursive: true });

  const networks = await safeReadDir(contractsDeploymentsRoot);
  const addressBook = {};

  let abi = null;

  for (const network of networks) {
    const networkDir = path.join(contractsDeploymentsRoot, network);
    const deploymentFile = path.join(networkDir, "AuroraMosaic.json");
    const data = await safeReadJSON(deploymentFile);
    if (!data) continue;

    if (!abi && data.abi) {
      abi = data.abi;
    }

    if (data.address) {
      addressBook[data.chainId?.toString() ?? network] = {
        address: data.address,
        chainName: data.metadata?.name ?? network,
        chainId: data.chainId,
      };
    }
  }

  if (!abi) {
    throw new Error(
      `AuroraMosaic ABI not found. Deploy locally to create AuroraMosaic.json under ${contractsDeploymentsRoot}.`
    );
  }

  await writeFile(
    path.join(abiDir, "AuroraMosaicABI.ts"),
    `export const AuroraMosaicABI = ${JSON.stringify({ abi }, null, 2)} as const;\n`
  );

  await writeFile(
    path.join(abiDir, "AuroraMosaicAddresses.ts"),
    `export const AuroraMosaicAddresses = ${JSON.stringify(addressBook, null, 2)} as const;\n`
  );

  console.log("✅ AuroraMosaic ABI and address files generated");
}

async function safeReadDir(dir) {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

async function safeReadJSON(file) {
  try {
    const content = await readFile(file, "utf8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

main().catch((error) => {
  console.error("genabi.mjs failed:", error);
  process.exitCode = 1;
});

