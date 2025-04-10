import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useCowFarm } from "./hooks/CowFarm";
import { Toaster, toast } from "react-hot-toast";

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
  } = useCowFarm();

  const generated = referralCode && referralCode.length > 0;
  const [copied, setCopied] = useState(false);

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

  const handleBuyCow = async () => {
    try {
      await buyCow(1); // otomatis handle approve + beli
      toast.success("🐮 Bought a cow with $MILK!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to buy cow");
    }
  };

  const handleClaimMilk = async () => {
    try {
      await claimMilk();
      toast.success("🥛 Milk claimed!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to claim milk");
    }
  };

  const handleClaimFreeCow = async () => {
    try {
      await claimFreeCow();
      toast.success("🎁 Free Cow claimed!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to claim free cow");
    }
  };

  return (
    <div className="app-container">
      <Toaster position="top-center" />
      <div className="farm-card">
        <h1 className="title">🐮 Cow Farm</h1>

        <ConnectMenu />

        {isConnected && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  if (isConnected) {
    return (
      <div className="connect-box">
        <div className="text-xs">Connected as:</div>
        <div className="text-sm font-mono break-all">
          {shortenAddress(address!)}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="farm-button connect"
    >
      🔌 Connect Wallet
    </button>
  );
}

export default App;
