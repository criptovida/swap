
import React from 'react';

type IconProps = {
  className?: string;
};

// --- Coin Logos ---

export const BtcIcon: React.FC<IconProps> = (props) => (
  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" alt="Bitcoin" {...props} />
);

export const EthIcon: React.FC<IconProps> = (props) => (
  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" alt="Ethereum" {...props} />
);

export const BnbIcon: React.FC<IconProps> = (props) => (
  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" alt="BNB" {...props} />
);

export const UsdcIcon: React.FC<IconProps> = (props) => (
  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" alt="USD Coin" {...props} />
);

export const UsdtIcon: React.FC<IconProps> = (props) => (
  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="Tether" {...props} />
);

export const BtcBrIcon: React.FC<IconProps> = (props) => (
  <img src="https://poocoin.app/images/tokens/0x0cf8e180350253271f4b917ccfb0accc4862f262.png" alt="BTCBR" {...props} />
);

export const BnbtigerIcon: React.FC<IconProps> = (props) => (
  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/22987.png" alt="BNB Tiger Inu" {...props} />
);


// --- UI Icons ---

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
    </svg>
);

export const QrCodeIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 10h18M3 14h18M3 18h18" transform="rotate(90 12 12)"/>
    <path d="M4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4z"/>
  </svg>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const EyeSlashIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .91-2.846 3.196-5.23 6.042-6.23M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.007 10.007 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7a10.007 10.007 0 00-3.558.647M1 1l22 22" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
    </svg>
);

export const ArrowUpIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

export const ArrowDownIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

export const CreditCardIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export const PiggyBankIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h2"/>
  </svg>
);

export const FundsIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
    </svg>
);

export const SwitchVerticalIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l-4-4m4 4l4-4" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m5.632 5.684C15.114 15.062 15 14.518 15 14s.114-1.062.316-1.474m-5.632-5.684C8.886 6.938 9 6.482 9 6s-.114-.938-.316-1.342M12 21a9 9 0 100-18 9 9 0 000 18z"/>
    </svg>
);


// Bottom Nav Icons
export const HomeIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const SwapIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

export const DiscoverIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l.707-.707M12 21v-1m-6.364-1.636l.707-.707M17.636 17.636l-.707-.707M9 13a3 3 0 013-3h0a3 3 0 013 3v4a3 3 0 01-3 3h0a3 3 0 01-3-3v-4z"/>
    </svg>
);

export const BrowserIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6a2 2 0 100-4 2 2 0 000 4zm0 12a2 2 0 100-4 2 2 0 000 4z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3a9 9 0 100 18 9 9 0 000 18z"/>
    </svg>
);

// --- Auth Page Icons ---
export const MailIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
);
export const LockClosedIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);
export const UserIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);
export const GoogleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.688,44,30.417,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);
export const AppleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" {...props}>
        <path d="M 25.041016 4 C 20.384016 4 15.939219 6.2085313 14.537109 10.640625 C 10.158109 10.424625 5.5 13.118625 5.5 18.5 C 5.5 24.5 10.339844 26.332031 10.511719 26.375 C 10.511719 26.375 10.222344 33.625 15.175781 37.150391 C 17.513781 38.830391 20.251719 39.125 21.824219 39.125 C 23.324219 39.125 24.332031 38.71875 26.544922 38.71875 C 28.757812 38.71875 29.576172 39.125 31.351562 39.125 C 32.925062 39.125 35.808281 38.753344 38.003906 37.039062 C 41.223906 34.698062 42.483047 30.682859 42.527344 30.619141 C 42.527344 30.619141 37.601562 28.667969 37.550781 22.5 C 37.488781 16.48 41.511719 13.933594 41.660156 13.84375 C 38.435156 10.35175 33.615984 9.6875 32.115234 9.6875 C 29.155234 9.5845 26.251812 11.847656 25.041016 11.847656 C 23.829219 11.847656 20.637734 9.78225 18.359375 9.71875 C 18.250375 9.70275 18.150391 9.6875 18.041016 9.6875 C 16.741016 9.6875 13.911078 10.035156 12.480469 12.34375 C 15.023469 13.51375 16.324219 15.824219 16.324219 18.5 C 16.324219 22.11 14.474609 24.205078 12.392578 25.326172 C 14.112578 30.767172 19.333344 33.914062 21.650391 33.914062 C 22.840391 33.914062 23.958984 33.53125 25.041016 33.53125 C 26.123047 33.53125 27.653656 33.914062 28.810547 33.914062 C 31.250547 33.914062 35.814844 30.583937 36.46875 25.125 C 33.13875 24.255 31.074219 21.664062 31.074219 18.5 C 31.074219 14.75 33.525234 12.24825 36.5 11.125 C 34.509 8.311 31.189453 6.375 27.958984 6.375 C 26.173984 6.375 24.518516 6.8833125 23.333984 7.6816406 C 22.250984 7.0206406 20.825016 6.46875 19.458984 6.46875 C 16.128984 6.46875 12.5 8.75 12.5 12.875 C 12.5 15.315 13.628906 17.433594 15.414062 18.511719 C 15.414062 18.511719 19.551609 16.332031 22.324219 16.332031 C 24.524219 16.332031 27.361172 17.65625 28.800781 17.65625 C 27.500781 14.28625 24.116016 12.34375 21.083984 12.34375 C 18.052984 12.34375 16.033328 14.21875 14.882812 14.21875 C 14.232813 14.21875 12.107422 13.5 10.5 15.75 C 10.5 10.5 17.843016 8 21.824219 8 C 22.875219 8 23.959984 8.21975 25.041016 8.5 C 25.228016 8.561 25.432609 8.6210937 25.640625 8.6875 C 25.744625 8.7195 25.859375 8.75 26 8.75 C 27.5 8.75 29.5 8 31 7 C 29.283 5.401 27.243984 4.5 25.041016 4.5 C 25.041016 4.333 25.041016 4.167 25.041016 4 Z"></path>
    </svg>
);


// --- Admin Panel Icons ---
export const ChartBarIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const UserGroupIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a5.002 5.002 0 019 0m-9 0a5.002 5.002 0 00-9 0m9 0h.008v.008H12v-.008z" />
    </svg>
);

export const CubeIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

export const CreditCardSolidIcon: React.FC<IconProps> = (props) => (
    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
);

export const ArrowRightOnRectangleIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);
