# 🐄 CowFarm Web3

**A Relaxing Decentralized Farming Simulator**

CowFarm is a Web3-based "Play-to-Earn" (P2E) mini-game where users can manage a digital cattle farm. Build with **Reown**, **Vite**, and **Tailwind CSS**.

---

## 🎮 Game Mechanics

* **🐂 Random Minting**: Buy a cow and get a random Gender and Weight.
* **🥛 Milk Production**: Female cows produce **$MILK** daily.
* **⏳ Smart Cooldown**: Harvest for 7 days then rest for 7 days.
* **🥩 Slaughter (Burn)**: Burn your NFT to get **$MEAT** tokens based on weight.

---

## 🛠 Tech Stack

- **Framework**: React + Vite + TypeScript
- **Wallet Connection**: [Reown AppKit](https://reown.com/)
- **Blockchain**: Wagmi & Viem
- **Styling**: Tailwind CSS
- **Smart Contracts**: Solidity (ERC-721 & ERC-20)

---

## 📂 Project Structure

```text
src/
├── abis/            # Contract ABIs (CowNFT, Engine, Tokens)
├── components/      # UI: Header, Footer, CowCard
├── hooks/           # Custom Hooks: useFarm.ts
├── constants/       # contracts.ts (Addresses & ABIs)
└── pages/           # Main Farm Page