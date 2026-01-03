
import React from 'react';
import { BtcIcon, EthIcon, BnbIcon, UsdcIcon, UsdtIcon, ShieldIcon } from './icons';

interface LandingPageProps {
  onNavigateToAuth: (view: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div 
        className="relative w-full h-full bg-gray-50 text-gray-800 p-8 rounded-2xl shadow-lg flex flex-col justify-between overflow-hidden" 
        style={{ width: '392px', height: '644px' }}
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center mt-12">
        <div className="inline-flex items-center justify-center bg-white/60 backdrop-blur-sm p-4 rounded-full mb-6 ring-1 ring-inset ring-gray-200">
          <ShieldIcon className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Your Gateway to Digital Assets</h1>
        <p className="text-gray-600 max-w-xs mx-auto leading-relaxed">
          Manage, swap, and truly own your crypto with a wallet that puts you in control.
        </p>
      </div>

      {/* Supported Assets Section */}
      <div className="relative z-10">
         <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl ring-1 ring-inset ring-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 mb-4 tracking-wider uppercase text-center">Supported Assets</h3>
            <div className="flex justify-center items-center space-x-4">
              <BtcIcon className="w-9 h-9" />
              <EthIcon className="w-9 h-9" />
              <BnbIcon className="w-9 h-9" />
              <UsdcIcon className="w-9 h-9" />
              <UsdtIcon className="w-9 h-9" />
            </div>
         </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="relative z-10 mb-8 space-y-4">
        <button
          onClick={() => onNavigateToAuth('signup')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create a New Wallet
        </button>
        <button
          onClick={() => onNavigateToAuth('login')}
          className="w-full text-blue-600 font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-50"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
