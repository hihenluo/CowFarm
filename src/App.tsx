{isConnected && (
  <>
    <div className="status-box">
      <div>🐄 Cows: <strong>{cowCount}</strong></div>
      <div>🥛 Milk: <strong>{milkAmount}</strong></div>
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

    {/* ✅ Tampilkan tombol generate referral hanya kalau eligible */}
    {canGenerateReferral && !referralCode && (
      <button
        className="farm-button share"
        onClick={handleGenerateReferral}
      >
        ✨ Generate Referral Code
      </button>
    )}

    {/* ✅ Tampilkan link referral setelah punya code */}
    {referralCode && (
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
