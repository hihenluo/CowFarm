import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { 
  FARM_ENGINE_ADDRESS, 
  FARM_ENGINE_ABI, 
  MILK_TOKEN_ADDRESS, 
  MILK_ABI,
  MEAT_TOKEN_ADDRESS 
} from '../constants/contracts'

export const useFarm = () => {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  // --- READS ---
  const { data: milkBalance } = useReadContract({
    abi: MILK_ABI,
    address: MILK_TOKEN_ADDRESS,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: meatBalance } = useReadContract({
    abi: MILK_ABI, 
    address: MEAT_TOKEN_ADDRESS,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // --- WRITES ---
  const buyCow = async () => {
    return await writeContractAsync({
      address: FARM_ENGINE_ADDRESS,
      abi: FARM_ENGINE_ABI,
      functionName: 'buyCow',
      value: BigInt(10000000000000000), // 0.01 ETH
    })
  }

  const claimMilk = async (tokenId: number) => {
    return await writeContractAsync({
      address: FARM_ENGINE_ADDRESS,
      abi: FARM_ENGINE_ABI,
      functionName: 'harvest',
      args: [BigInt(tokenId)],
    })
  }

  const burnForMeat = async (tokenId: number) => {
    return await writeContractAsync({
      address: FARM_ENGINE_ADDRESS,
      abi: FARM_ENGINE_ABI,
      functionName: 'slaughter',
      args: [BigInt(tokenId)],
    })
  }

  return { 
    address, 
    milkBalance, 
    meatBalance, 
    buyCow, 
    claimMilk, 
    burnForMeat 
  }
}