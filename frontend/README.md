# AuroraMosaic Frontend

The AuroraMosaic frontend is built with Next.js, Tailwind CSS, and the FHEVM SDK, following the `zama_template` layout. It supports both the local Hardhat FHEVM mock as well as the Sepolia relayer workflow.

## Installation

```bash
cd action/frontend
npm install
```

### Sync ABI and Addresses

Deploy or compile the contracts inside `action/contracts`, then run:

```bash
npm run generate:abi
```

By default the script reads `../contracts/deployments/AuroraMosaic.json` and produces:

- `abi/AuroraMosaicABI.ts`
- `abi/AuroraMosaicAddresses.ts`

Override the source via `CONTRACTS_DEPLOYMENTS_ROOT=/abs/path/to/deployments` if necessary.

## Local Development (FHEVM Mock)

1. Start the Hardhat node and deploy the contracts from `action/contracts`.
2. Run `npm run dev` in this directory.
3. Open `http://localhost:3000` and connect MetaMask (default `chainId=31337`). The app uses `@fhevm/mock-utils` to encrypt/decrypt strokes locally.

## Sepolia Relayer Mode

1. Deploy to Sepolia and run `npm run generate:abi` again to sync addresses.
2. Add the endpoint to `.env.local`:

   ```bash
   NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<API_KEY>
   ```

3. Launch with `npm run dev` or build/start with `npm run build && npm run start`.

When the chain ID is `11155111`, the frontend automatically loads `@zama-fhe/relayer-sdk` to initialize the FHEVM instance and cache signatures.

## Highlights

- 128×128 collaborative panel with fully encrypted tile submission.
- Automatic switching between mock and relayer FHEVM flows.
- Dynamic palette, live event subscriptions, and decrypted statistics.
- Seal panels, upload IPFS CIDs, and mint Aurora Relic NFTs.
- Multi-page UI: landing overview, `/canvas` collaboration space, `/my-creations` inspiration history, and `/gallery` archive—each reachable via the global navbar with live chain indicators.

## Commands

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start the local development server           |
| `npm run build`       | Create a production build                    |
| `npm run start`       | Launch the production server                 |
| `npm run lint`        | Run the Next.js ESLint configuration         |
| `npm run test`        | Execute the Vitest suite (jsdom environment) |
| `npm run generate:abi`| Generate ABI/address stubs from Hardhat      |

## Environment Variables

| Variable                     | Purpose                                           |
| ---------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL`| HTTP endpoint for the Sepolia relayer workflow    |
| `CONTRACTS_DEPLOYMENTS_ROOT` | Optional override for the deployments directory   |

