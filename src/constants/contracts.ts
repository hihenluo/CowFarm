export const FARM_ENGINE_ADDRESS = "0x..." 
export const MILK_TOKEN_ADDRESS = "0x..."
export const MEAT_TOKEN_ADDRESS = "0x..."
export const COW_NFT_ADDRESS = "0x..."

export const MILK_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  }
] as const;

export const MEAT_ABI = MILK_ABI; 

export const FARM_ENGINE_ABI = [
  // READ Functions
  {
    name: "cowStats",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "gender", type: "uint8" },
      { name: "weight", type: "uint256" },
      { name: "lastHarvest", type: "uint256" },
      { name: "harvestCount", type: "uint8" },
      { name: "cooldownEnd", type: "uint256" },
    ],
  },
  // WRITE Functions
  {
    name: "buyCow",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "harvest",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "slaughter",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "breed",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "p1", type: "uint256" },
      { name: "p2", type: "uint256" },
    ],
    outputs: [],
  }
] as const;