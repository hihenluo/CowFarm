import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import CowFarmAbi from "../abis/CowFarm.json";
import MilkAbi from "../abis/Milk.json";

const CowFarmAddress = "0xYourCowFarmAddressHere";
const MilkTokenAddress = "0xYourMilkTokenAddressHere";

export function useCowFarm() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [cowCount, setCowCount] = useState(0);
  const [milkAmount, setMilkAmount] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  async function fetchData() {
    if (!address) return;
    const [cows, milk, claimed, code] = await Promise.all([
      publicClient.readContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "getCowCount",
        args: [address],
      }),
      publicClient.readContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "getPendingMilk",
        args: [address],
      }),
      publicClient.readContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "hasClaimedFreeCow",
        args: [address],
      }),
      publicClient.readContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "getReferralCode",
        args: [address],
      }),
    ]);
    setCowCount(Number(cows));
    setMilkAmount(Number(milk));
    setHasClaimed(claimed);
    setReferralCode(code);
  }

  useEffect(() => {
    fetchData();
  }, [address]);

  async function claimFreeCow() {
    if (!walletClient || !address) return;
    const sig = await walletClient.signMessage({ message: `Claiming free cow for ${address}` });
    await walletClient.writeContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "claimFreeCow",
      args: [sig],
    });
    fetchData();
  }

  async function claimMilk() {
    if (!walletClient) return;
    await walletClient.writeContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "claimMilk",
    });
    fetchData();
  }

  async function buyCowWithMilk(amount) {
    if (!walletClient || !address) return;
    const milkPrice = await publicClient.readContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "milkPrice",
    });
    const totalCost = BigInt(milkPrice) * BigInt(amount);

    const allowance = await publicClient.readContract({
      address: MilkTokenAddress,
      abi: MilkAbi,
      functionName: "allowance",
      args: [address, CowFarmAddress],
    });

    if (BigInt(allowance) < totalCost) {
      await walletClient.writeContract({
        address: MilkTokenAddress,
        abi: MilkAbi,
        functionName: "approve",
        args: [CowFarmAddress, totalCost],
      });
    }

    await walletClient.writeContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "buyCowWithMilk",
      args: [amount],
    });
    fetchData();
  }

  async function registerReferralCode(code) {
    if (!walletClient || !address) return;
    await walletClient.writeContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "registerReferralCode",
      args: [code],
    });
    fetchData();
  }

  return {
    cowCount,
    milkAmount,
    hasClaimed,
    claimFreeCow,
    claimMilk,
    buyCowWithMilk,
    referralCode,
    registerReferralCode,
  };
}
