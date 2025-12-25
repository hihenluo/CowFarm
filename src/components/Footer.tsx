
import { Github, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="flex gap-8 mb-8 text-gray-400">
          <a href="#" className="hover:text-green-600 transition-colors flex items-center gap-1 text-sm font-medium">
            <ShieldCheck size={16} /> Verified Contracts
          </a>
          <a href="#" className="hover:text-green-600 transition-colors flex items-center gap-1 text-sm font-medium">
            <Github size={16} /> Source Code
          </a>
          <a href="#" className="hover:text-green-600 transition-colors flex items-center gap-1 text-sm font-medium">
            <ExternalLink size={16} /> Docs
          </a>
        </div>
        
        <div className="text-center">
          <p className="text-gray-400 text-sm italic">
            "Happy cows produce the best $MILK"
          </p>
          <p className="text-gray-300 text-[10px] mt-4 tracking-widest uppercase font-bold">
            © 2025 CowFarm Web3 Engine • Built with Reown & Vite
          </p>
        </div>
      </div>
    </footer>
  );
};