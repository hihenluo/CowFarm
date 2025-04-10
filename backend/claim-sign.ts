import { getFIDFromAddress } from "./warpcast";
import { createPublicClient, http, encodePacked, keccak256, toBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY!;

export async function getSignature(address: string, code: string, fid: number) {
  const verifiedFID = await getFIDFromAddress(address);
  if (!verifiedFID || verifiedFID !== fid) {
    throw new Error("FID mismatch");
  }

  const messageHash = keccak256(
    toBytes(encodePacked(["string", "uint256", "address"], [code, BigInt(fid), address]))
  );

  const account = privateKeyToAccount(`0x${SIGNER_PRIVATE_KEY}`);
  const signature = await account.signMessage({ message: { raw: messageHash } });

  return signature;
}
