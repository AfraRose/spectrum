import type { FhevmInstance } from "../fhevmTypes";

export type FhevmRelayerSDKType = {
  __initialized__?: boolean;
  initSDK: (options?: FhevmInitSDKOptions) => Promise<boolean>;
  createInstance: (config: FhevmInstanceConfig) => Promise<FhevmInstance>;
  SepoliaConfig: {
    aclContractAddress: `0x${string}`;
    kmsContractAddress: `0x${string}`;
    inputVerifierContractAddress: `0x${string}`;
    verifyingContractAddressDecryption: `0x${string}`;
    verifyingContractAddressInputVerification: `0x${string}`;
    chainId: number;
    gatewayChainId: number;
    network: string;
    relayerUrl: string;
  };
};

export type FhevmInitSDKOptions =
  | {
      apiKey?: string;
      relayerUrl?: string;
    }
  | undefined;

export type FhevmInstanceConfig = {
  network: string | unknown;
  publicKey?: string;
  publicParams?: Uint8Array;
  aclContractAddress: `0x${string}`;
  kmsContractAddress: `0x${string}`;
  inputVerifierContractAddress: `0x${string}`;
  verifyingContractAddressDecryption: `0x${string}`;
  verifyingContractAddressInputVerification: `0x${string}`;
  chainId: number;
  gatewayChainId: number;
  relayerUrl: string;
};

export type FhevmWindowType = Window &
  typeof globalThis & {
    relayerSDK: FhevmRelayerSDKType;
  };

export type FhevmLoadSDKType = () => Promise<void>;
export type FhevmInitSDKType = (options?: FhevmInitSDKOptions) => Promise<boolean>;

