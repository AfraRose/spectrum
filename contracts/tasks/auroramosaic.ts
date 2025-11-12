import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { FhevmType } from "@fhevm/hardhat-plugin";

task("aurora:decrypt-tile", "Decrypt a tile handle from a deployed AuroraMosaic panel")
  .addParam("panel", "Panel identifier")
  .addParam("x", "Tile X coordinate")
  .addParam("y", "Tile Y coordinate")
  .addOptionalParam("address", "AuroraMosaic contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const panelId = Number(taskArguments.panel);
    const x = Number(taskArguments.x);
    const y = Number(taskArguments.y);

    const deployment =
      taskArguments.address !== undefined
        ? { address: taskArguments.address as string }
        : await deployments.get("AuroraMosaic");

    const auroraMosaic = await ethers.getContractAt("AuroraMosaic", deployment.address);

    const tileView = await auroraMosaic.viewTile(panelId, x, y);
    if (tileView.encryptedColor === ethers.ZeroHash) {
      console.log("Tile is empty (handle == 0)");
      return;
    }

    const [signer] = await ethers.getSigners();

    const clearColor = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      tileView.encryptedColor,
      deployment.address,
      signer
    );

    console.log(`Tile (${panelId}, ${x}, ${y}) by ${tileView.artisan} at ${tileView.updatedAt}`);
    console.log(`Encrypted handle: ${tileView.encryptedColor}`);
    console.log(`Clear color (uint32): ${clearColor}`);
  });

task("aurora:decrypt-brushes", "Decrypt the encrypted brush count of a panel")
  .addParam("panel", "Panel identifier")
  .addOptionalParam("address", "AuroraMosaic contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const panelId = Number(taskArguments.panel);

    const deployment =
      taskArguments.address !== undefined
        ? { address: taskArguments.address as string }
        : await deployments.get("AuroraMosaic");

    const auroraMosaic = await ethers.getContractAt("AuroraMosaic", deployment.address);
    const encryptedCount = await auroraMosaic.panelBrushTotal(panelId);

    if (encryptedCount === ethers.ZeroHash) {
      console.log(`Panel ${panelId} has zero strokes`);
      return;
    }

    const [signer] = await ethers.getSigners();

    const clearCount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedCount,
      deployment.address,
      signer
    );

    console.log(`Panel ${panelId} has ${clearCount} brush strokes (decrypted)`);
  });

