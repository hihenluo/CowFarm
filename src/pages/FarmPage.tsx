import React from 'react';
import { useFarm } from '../hooks/useFarm';
import { Milk, Beef, PlusCircle, Timer, Zap, History } from 'lucide-react';

const MOCK_COWS = [
  { id: 1, gender: 1, weight: 210, harvestCount: 3, isCooldown: false },
  { id: 2, gender: 0, weight: 185, harvestCount: 0, isCooldown: false },
  { id: 3, gender: 1, weight: 240, harvestCount: 7, isCooldown: true },
];

export const FarmPage = () => {
  const { buyCow, claimMilk, burnForMeat, milkBalance, meatBalance } = useFarm();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500">
              <Milk size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Milk Balance</p>
              <p className="text-3xl font-black text-gray-800">
                {(Number(milkBalance || 0) / 100).toFixed(2)} <span className="text-lg font-medium text-gray-400">L</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-red-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-4 rounded-2xl text-red-500">
              <Beef size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Meat Balance</p>
              <p className="text-3xl font-black text-gray-800">
                {(Number(meatBalance || 0) / 100).toFixed(2)} <span className="text-lg font-medium text-gray-400">Kg</span>
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => buyCow()}
          className="bg-green-600 hover:bg-green-700 text-white rounded-[2rem] p-6 shadow-xl shadow-green-100 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4 group"
        >
          <PlusCircle size={32} className="group-hover:rotate-90 transition-transform" />
          <div className="text-left">
            <p className="text-xs font-bold uppercase opacity-80">Marketplace</p>
            <p className="text-xl font-black">Buy Random Cow</p>
          </div>
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">My Stable</h2>
            <p className="text-gray-500 font-medium">You have {MOCK_COWS.length} cows in your farm</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl transition-colors">
            <History size={18} /> Transaction History
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_COWS.map((cow) => (
            <div key={cow.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="h-48 bg-gradient-to-b from-green-50 to-white flex items-center justify-center relative">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                  {cow.gender === 1 ? '🐄' : '🐂'}
                </span>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cow.gender === 1 ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                  {cow.gender === 1 ? 'Female' : 'Male'}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Cow #{cow.id}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                    <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                    {cow.weight}kg
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                    <span>Weekly Progress</span>
                    <span>{cow.harvestCount}/7 Days</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${cow.isCooldown ? 'bg-orange-400' : 'bg-green-500'}`}
                      style={{ width: `${(cow.harvestCount / 7) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {cow.isCooldown ? (
                    <div className="col-span-2 bg-orange-50 text-orange-600 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold border border-orange-100">
                      <Timer size={18} /> Resting Period
                    </div>
                  ) : (
                    <>
                      <button 
                        disabled={cow.gender === 0}
                        onClick={() => claimMilk(cow.id)}
                        className="flex flex-col items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400 text-white p-3 rounded-2xl transition-colors"
                      >
                        <Milk size={20} />
                        <span className="text-[10px] font-bold uppercase">Harvest</span>
                      </button>
                      <button 
                        onClick={() => burnForMeat(cow.id)}
                        className="flex flex-col items-center justify-center gap-1 bg-white border-2 border-red-50 text-red-500 hover:bg-red-50 p-3 rounded-2xl transition-colors"
                      >
                        <Beef size={20} />
                        <span className="text-[10px] font-bold uppercase">Slaughter</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};