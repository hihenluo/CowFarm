export async function verifyFidWithAddress(fid: number, address: string): Promise<boolean> {
    try {
      const res = await fetch(`https://api.warpcast.com/v2/user-by-fid?fid=${fid}`);
      const json = await res.json();
      const custody = json.result?.user?.custodyAddress;
      return custody?.toLowerCase() === address.toLowerCase();
    } catch (err) {
      console.error("Warpcast check failed", err);
      return false;
    }
  }
  