import { VercelRequest, VercelResponse } from '@vercel/node';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { createWalletClient, http } from 'viem';
import { verifyFidWithAddress } from './warpcast';

const signer = privateKeyToAccount(`0x${process.env.SIGNER_PRIVATE_KEY}`);
const client = createWalletClient({
  account: signer,
  chain: base,
  transport: http(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { address, referralCode, fid } = req.body;

  if (!address || !referralCode || typeof fid !== 'number') {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const valid = await verifyFidWithAddress
