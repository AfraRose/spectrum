import { ethers, network } from "hardhat";

async function main() {
  const deployment = require(`../deployments/${network.name}/AuroraMosaic.json`);
  const auroraMosaic = await ethers.getContractAt("AuroraMosaic", deployment.address);

  const tx = await auroraMosaic.initiatePanel(128, 128);
  const receipt = await tx.wait();
  const event = receipt?.logs
    ?.map((log) => {
      try {
        return auroraMosaic.interface.parseLog(log);
      } catch {
        return undefined;
      }
    })
    .find((parsed) => parsed && parsed.name === "PanelStarted");

  const panelId =
    event?.args?.panelId !== undefined ? Number(event.args.panelId) : undefined;
  console.log(
    `Panel started on network ${network.name} with ID: ${
      panelId ?? "(unknown)"
    }`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

