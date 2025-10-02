import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains';

// Configuración de RainbowKit
export const config = getDefaultConfig({
  appName: 'COD3.0 HACKATHON',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // Obtén tu Project ID de https://cloud.walletconnect.com/
  chains: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  ssr: true, // Si tu dApp usa server side rendering (SSR)
});

// Configuración de cadenas personalizadas si necesitas
export const customChains = {
  // Puedes agregar cadenas personalizadas aquí si es necesario
};

// Configuración de wallets personalizadas
export const customWallets = [
  // Puedes agregar wallets personalizadas aquí
];
