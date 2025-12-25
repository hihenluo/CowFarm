

export const Header = () => {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-4xl transform group-hover:rotate-12 transition-transform duration-300">
              🐄
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-green-700 tracking-tighter leading-none">
                COWFARM
              </span>
              <span className="text-[10px] font-bold text-green-500 tracking-[0.2em] uppercase">
                Web3 Edition
              </span>
            </div>
          </div>

          
          <div className="flex items-center">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-50">
              <appkit-button />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;