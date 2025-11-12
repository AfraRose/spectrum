import { expect } from "chai";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { AuroraMosaic } from "../types";
import hre, { ethers, deployments, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("AuroraMosaic (local mock)", function () {
  let deployer: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let auroraMosaic: AuroraMosaic;

  before(async function () {
    const signers = await ethers.getSigners();
    [deployer, alice] = signers;
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("AuroraMosaic local tests require the FHEVM mock environment");
      this.skip();
    }

    await deployments.fixture(["AuroraMosaic"]);

    const deployment = await deployments.get("AuroraMosaic");
    auroraMosaic = await ethers.getContractAt("AuroraMosaic", deployment.address);
  });

  it("creates a panel and paints an encrypted tile", async function () {
    const tx = await auroraMosaic.connect(alice).initiatePanel(128, 128);
    const receipt = await tx.wait();
    const panelId = receipt?.logs[0]?.args?.panelId ?? 1n;

    const input = await fhevm
      .createEncryptedInput(auroraMosaic.target as string, alice.address)
      .add32(0xff3366);
    const encryptedColor = await input.encrypt();

    await expect(
      auroraMosaic
        .connect(alice)
        .applyTile(
          Number(panelId),
          10,
          20,
          encryptedColor.handles[0],
          encryptedColor.inputProof
        )
    ).to.emit(auroraMosaic, "TileBrushed");

    const tileView = await auroraMosaic.viewTile(Number(panelId), 10, 20);
    expect(tileView.artisan).to.equal(alice.address);
    expect(tileView.encryptedColor).to.not.equal(ethers.ZeroHash);

    const decrypted = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      tileView.encryptedColor,
      auroraMosaic.target as string,
      alice
    );
    expect(Number(decrypted)).to.equal(0xff3366);
  });

  it("increments encrypted brush counters", async function () {
    const tx = await auroraMosaic.connect(deployer).initiatePanel(32, 32);
    const receipt = await tx.wait();
    const panelId = Number(receipt?.logs[0]?.args?.panelId ?? 1n);

    const firstPixelInput = await fhevm
      .createEncryptedInput(auroraMosaic.target as string, deployer.address)
      .add32(0x123456);
    const firstEncrypted = await firstPixelInput.encrypt();

    await auroraMosaic
      .connect(deployer)
      .applyTile(panelId, 0, 0, firstEncrypted.handles[0], firstEncrypted.inputProof);

    const strokeCountEncrypted = await auroraMosaic.panelBrushTotal(panelId);
    const decryptedCount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      strokeCountEncrypted,
      auroraMosaic.target as string,
      deployer
    );
    expect(Number(decryptedCount)).to.equal(1);
  });
});

