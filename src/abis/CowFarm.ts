import { Abi } from 'viem';

export const CowFarmAbi = [
  {
    name: 'getUserCowCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'cowPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'buyCow',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'claimMilk',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'claimFreeCow',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'signature', type: 'string' }],
    outputs: [],
  },
  {
    name: 'getPendingMilk',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'hasClaimedFreeCow',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'getReferralCode',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'milkPerDayPerCow',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'registerReferralCode',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'code', type: 'string' }],
    outputs: [],
  },
] as const satisfies Abi;
