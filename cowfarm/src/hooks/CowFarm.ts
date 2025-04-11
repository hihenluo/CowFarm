// (semua import dan deklarasi awal tetap)

export function useCowFarm() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [cowCount, setCowCount] = useState(0);
  const [milkAmount, setMilkAmount] = useState(0);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState("");
  const [estimatedMilk, setEstimatedMilk] = useState(0);
  const [milkPerSecond, setMilkPerSecond] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [canGenerateReferral, setCanGenerateReferral] = useState(false);

  async function fetchData() {
    if (!address || !publicClient) return;

    try {
      const [cowsRaw, milk, claimed, code, milkPerDay] = await Promise.all([
        publicClient.readContract({ address: CowFarmAddress, abi: CowFarmAbi, functionName: "getUserCowCount", args: [address] }),
        publicClient.readContract({ address: CowFarmAddress, abi: CowFarmAbi, functionName: "getPendingMilk", args: [address] }),
        publicClient.readContract({ address: CowFarmAddress, abi: CowFarmAbi, functionName: "hasClaimedFreeCow", args: [address] }),
        publicClient.readContract({ address: CowFarmAddress, abi: CowFarmAbi, functionName: "getReferralCode", args: [address] }),
        publicClient.readContract({ address: CowFarmAddress, abi: CowFarmAbi, functionName: "milkPerDayPerCow" }),
      ]);

      const cowCount = Number(cowsRaw);
      const milkAmountNum = Number(milk);
      const milkPerSecondCalculated = (Number(milkPerDay) / 86400) * cowCount;

      setCowCount(cowCount);
      setMilkAmount(milkAmountNum);
      setEstimatedMilk(milkAmountNum);
      setHasClaimed(claimed as boolean);
      setReferralCode(code as string);
      setMilkPerSecond(milkPerSecondCalculated);
      setLastUpdated(Date.now());

      const codeExists = typeof code === "string" && code !== "" && code !== "0x";
      const cowsOwned = cowCount > 0;
      setCanGenerateReferral(cowsOwned && !codeExists);
    } catch (err) {
      console.error("❌ fetchData error", err);
    }
  }

  useEffect(() => {
    if (address && publicClient) fetchData();
  }, [address, publicClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsPassed = (Date.now() - lastUpdated) / 1000;
      const additionalMilk = milkPerSecond * secondsPassed;
      setEstimatedMilk((prev) => prev + additionalMilk);
    }, 1000);
    return () => clearInterval(interval);
  }, [milkPerSecond, lastUpdated]);

  async function claimFreeCow(referralCode: string, fid: number) {
    if (!walletClient || !address) return;

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/claim-sign`, {
      method: "POST",
      body: JSON.stringify({ address, referralCode, fid }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to get signature from backend");

    const { signature } = await response.json();

    await walletClient.writeContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "claimFreeCowWithFID",
      args: [referralCode, BigInt(fid), signature],
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

  async function buyCow(amount: number) {
    if (!walletClient || !address) return;

    const cowPrice = await publicClient.readContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "cowPrice",
    }) as bigint;

    const totalCost = cowPrice * BigInt(amount);

    const allowance = await publicClient.readContract({
      address: MilkTokenAddress,
      abi: MilkAbi,
      functionName: "allowance",
      args: [address, CowFarmAddress],
    }) as bigint;

    if (allowance < totalCost) {
      await walletClient.writeContract({
        address: MilkTokenAddress,
        abi: MilkAbi,
        functionName: "approve",
        args: [CowFarmAddress, totalCost],
      });
      await new Promise((res) => setTimeout(res, 4000));
    }

    await walletClient.writeContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "buyCow",
      args: [BigInt(amount)],
    });

    fetchData();
  }

  async function registerReferralCode(code: string) {
    if (!walletClient || !address) return;
    await walletClient.writeContract({
      address: CowFarmAddress,
      abi: CowFarmAbi,
      functionName: "registerReferralCode",
      args: [code],
    });

    await fetchData(); // 💡 pastikan tombol hilang dan kode ter-update
  }

  return {
    cowCount,
    milkAmount,
    estimatedMilk,
    setMilkPerSecond,
    hasClaimed,
    claimFreeCow,
    claimMilk,
    buyCow,
    referralCode,
    registerReferralCode,
    canGenerateReferral,
    refresh: fetchData,
  };
}
