export async function getFIDFromAddress(address: string): Promise<number | null> {
    const res = await fetch(
      `https://api.warpcast.com/v2/user-by-verification?address=${address.toLowerCase()}`
    );
  
    if (!res.ok) {
      console.error("Failed to fetch from Warpcast API");
      return null;
    }
  
    const json = await res.json();
    return json?.result?.user?.fid ?? null;
  }
  