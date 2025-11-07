import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useCowFarm } from "./hooks/CowFarm";
import { useReferralAndFid } from "./hooks/useReferralAndFid";
import { Toaster, toast } from "react-hot-toast";
import { ConnectWalletPage } from "./pages/ConnectWalletPage";

function App() {
  const { isConnected } = useAccount();
  const {
    claimFreeCow,
    claimMilk,
    buyCow,
    cowCount,
    milkAmount,
    hasClaimed,
    referralCode,
    registerReferralCode,
    canGenerateReferral,
    refresh,
  } = useCowFarm();

  const { referralCode: incomingReferral, fid } = useReferralAndFid();
  const [copied, setCopied] = useState(false);
  const generated = referralCode && referralCode.length > 0;

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const handleBuyCow = async () => {
    try {
      await buyCow(1);
      toast.success("🐮 Bought a cow with $MILK!");
    } catch (error: any) {
      console.error("🧨 buyCow error:", error);
      toast.error(error?.code === 4001 ? "❌ User cancelled transaction" : "Failed to buy cow");
    }
  };

  const handleClaimMilk = async () => {
    try {
      await claimMilk();
      toast.success("🥛 Milk claimed!");
    } catch (error: any) {
      toast.error(error?.code === 4001 ? "❌ User cancelled transaction" : "Failed to claim milk");
    }
  };

  const handleClaimFreeCow = async () => {
    if (!incomingReferral || !fid) {
      toast.error("Missing referral code or FID");
      return;
    }
    try {
      await claimFreeCow(incomingReferral, fid);
      toast.success("🎁 Free Cow claimed!");
    } catch (error: any) {
      toast.error(error?.code === 4001 ? "❌ User cancelled transaction" : "Failed to claim free cow");
    }
  };

  const handleGenerateReferral = async () => {
    try {
      const randomCode = `cow-${Math.random().toString(36).substring(2, 8)}`;
      await registerReferralCode(randomCode);
      toast.success("Referral code generated!");
      await refresh();
    } catch {
      toast.error("Failed to generate referral code");
    }
  };

  if (!isConnected) {
    return <ConnectWalletPage />;
  }

  return (
    
    <div className="app-container">
      <Toaster position="top-center" />
      <div className="farm-card">
        <h1 className="title">🐮 Cow Farm</h1>
          <div className="flex justify-center mt-6">
           <appkit-button />
        </div>


        


        <div className="status-box">
          <div>
            🐄 Cows: <strong>{cowCount}</strong>
          </div>
          <div>
            🥛 Milk: <strong>{milkAmount}</strong>
          </div>
        </div>

        <button className="farm-button milk" onClick={handleClaimMilk}>
          🥛 Claim Milk
        </button>

        <button className="farm-button buy" onClick={handleBuyCow}>
          🛒 Buy Cow
        </button>

        <button
          className="farm-button free"
          disabled={hasClaimed}
          onClick={handleClaimFreeCow}
        >
          🎁 Claim Free Cow
        </button>

        {canGenerateReferral && (
          <button className="farm-button share" onClick={handleGenerateReferral}>
            ✨ Generate Referral Code
          </button>
        )}

        {generated && (
          <div className="referral-box">
            <div className="label">🔗 Your Referral Link:</div>
            <button
              className="referral-link"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://warpcast.com/~/add-cowfarm?ref=${referralCode}`
                );
                setCopied(true);
                toast.success("Referral link copied!");
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              https://warpcast.com/~/add-cowfarm?ref={referralCode}
            </button>

            {copied && <div className="copied-msg">✅ Copied!</div>}

            <button
              className="share-button"
              onClick={() => {
                const url = `https://warpcast.com/~/compose?text=Join%20my%20Cow%20Farm%20🐮%20and%20get%20a%20free%20cow!%20https://warpcast.com/~/add-cowfarm?ref=${referralCode}`;
                window.open(url, "_blank");
              }}
            >
              🔗 Share on Warpcast
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
