import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

export function useReferralAndFid() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [fid, setFid] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("ref");
    if (code) setReferralCode(code);

    interface SDKWithState {
        state?: {
          fid?: number;
        };
      }
      
      const frameFid = (sdk as SDKWithState)?.state?.fid;
      
    if (frameFid) setFid(frameFid);
  }, []);

  return { referralCode, fid };
}
