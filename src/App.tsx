import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useCowFarm } from "./hooks/CowFarm";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const { isConnected, address } = useAccount();
  const {
    claimFreeCow,
    claimMilk,
    buyCowWithMilk,
    cowCount,
    milkAmount,
    hasClaimed,
    referralCode,
    registerReferralCode
  } = useCowFarm();

  const [copied, setCopied] = useState(false);
  const generated = referralCode && referralCode.length > 0;

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  useEffect(() => {
    if (isConnected && hasClaimed && !generated) {
      const randomCode = `cow-${Math.random().toString(36).substring(2, 8)}`;
      registerReferralCode(randomCode).catch(() => {
        toast.error("Failed to generate referral code");
      });
    }
  }, [isConnected, hasClaimed, generated, registerReferralCode]);

  return (
    <div className="min-h-screen bg-purple-100 text-purple-900 flex flex-col items-center p-6">
      <Toaster position="top-center" />

      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-4">
        <h1 className="text-3xl font-bold text-center mb-4">🐮 Cow Farm Mini</h1>

        <ConnectMenu />

        {isConnected && (
          <>
            <div className="flex justify-between items-center my-4">
              <div className="text-lg">🐄 Your Cows: {cowCount}</div>
              <div className="text-lg">🥛 Milk: {milkAmount}</div>
            </div>

            <button
              onClick={() => {
                claimMilk()
                  .then(() => toast.success("🥛 Milk claimed!"))
                  .catch(() => toast.error("Failed to claim milk"));
              }}
              className="w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-xl mb-2 hover:bg-purple-600"
            >
              🥛 Claim Milk
            </button>

            <button
              onClick={() => {
                buyCowWithMilk(1)
                  .then(() => toast.success("🐮 Cow bought with $MILK!"))
                  .catch(() => toast.error("Failed to buy cow"));
              }}
              className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl mb-2 hover:bg-green-600"
            >
              🛒 Buy Cow with $MILK
            </button>

            <button
              onClick={() => {
                claimFreeCow()
                  .then(() => toast.success("🎁 Free cow claimed!"))
                  .catch(() => toast.error("Failed to claim free cow"));
              }}
              disabled={hasClaimed}
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl mb-2 hover:bg-blue-600 disabled:opacity-50"
            >
              🎁 Claim Free Cow
            </button>

            {generated && (
              <div className="mt-4 p-3 border border-purple-300 rounded-xl bg-purple-50 text-sm text-center">
                <div className="mb-1 font-semibold">🔗 Your Referral Link:</div>
                <button
                  className="underline text-purple-600 hover:text-purple-800"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://warpcast.com/~/add-cowfarm?ref=${referralCode}`);
                    setCopied(true);
                    toast.success("Referral link copied!");
                  }}
                >
                  https://warpcast.com/~/add-cowfarm?ref={referralCode}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div className="text-sm text-center mt-2">
        <div>Connected as:</div>
        <div className="font-mono break-all">{address}</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] })}
      className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded-xl mb-4 hover:bg-yellow-500"
    >
      Connect Wallet
    </button>
  );
}

export default App;