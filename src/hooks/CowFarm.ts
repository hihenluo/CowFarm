import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import CowFarmAbi from "../abis/CowFarm.json";
import MilkAbi from "../abis/Milk.json";
import { toast } from "react-hot-toast";

const CowFarmAddress = "0x2d17B84d2C09C2ac8A8563aF42E415160dFc38df";
const MilkTokenAddress = "0xa7d79f82E8Df39aC92B430552a718e4667FF95a8";

export function useCowFarm() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [cowCount, setCowCount] = useState(0);
  const [milkAmount, setMilkAmount] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [estimatedMilk, setEstimatedMilk] = useState(0);
  const [milkPerHour, setMilkPerHour] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  async function fetchData() {
    if (!address) return;
    try {
      const [cows, milk, claimed, code, ratePerHour] = await Promise.all([
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
        publicClient.readContract({
          address: CowFarmAddress,
          abi: CowFarmAbi,
          functionName: "milkProductionPerHour",
        }),
      ]);

      setCowCount(Number(cows));
      setMilkAmount(Number(milk));
      setEstimatedMilk(Number(milk));
      setHasClaimed(claimed);
      setReferralCode(code);
      setMilkPerHour(Number(ratePerHour) * Number(cows));
      setLastUpdated(Date.now());
    } catch (err) {
      console.error("fetchData error", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [address]);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsPassed = (Date.now() - lastUpdated) / 1000;
      const additionalMilk = (milkPerHour / 3600) * secondsPassed;
      setEstimatedMilk((prev) => prev + additionalMilk);
    }, 1000);
    return () => clearInterval(interval);
  }, [milkPerHour, lastUpdated]);

  async function claimFreeCow() {
    if (!walletClient || !address) return;
    try {
      const sig = await walletClient.signMessage({
        message: `Claiming free cow for ${address}`,
      });
      await walletClient.writeContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "claimFreeCow",
        args: [sig],
      });
      fetchData();
    } catch (error: any) {
      if (error?.code === 4001) toast.error("❌ User cancelled transaction");
      else toast.error("Failed to claim free cow");
    }
  }

  async function claimMilk() {
    if (!walletClient) return;
    try {
      await walletClient.writeContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "claimMilk",
      });
      fetchData();
    } catch (error: any) {
      if (error?.code === 4001) toast.error("❌ User cancelled transaction");
      else toast.error("Failed to claim milk");
    }
  }

  async function buyCow(amount: number) {
    if (!walletClient || !address) return;
    try {
      const cowPrice = await publicClient.readContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "cowPrice",
      });
      const totalCost = BigInt(cowPrice) * BigInt(amount);

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
        functionName: "buyCow",
        args: [amount],
      });
      fetchData();
    } catch (error: any) {
      if (error?.code === 4001) toast.error("❌ User cancelled transaction");
      else toast.error("Failed to buy cow");
    }
  }

  async function registerReferralCode(code: string) {
    if (!walletClient || !address) return;
    try {
      await walletClient.writeContract({
        address: CowFarmAddress,
        abi: CowFarmAbi,
        functionName: "registerReferralCode",
        args: [code],
      });
      fetchData();
    } catch (error: any) {
      toast.error("Failed to register referral code");
    }
  }

  return {
    cowCount,
    milkAmount,
    estimatedMilk,
    milkPerHour,
    hasClaimed,
    claimFreeCow,
    claimMilk,
    buyCow,
    referralCode,
    registerReferralCode,
  };
}
