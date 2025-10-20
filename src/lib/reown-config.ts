import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient } from '@tanstack/react-query'

// 1. Get projectId from WalletConnect Cloud
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'cf008b83b4091707535a74aab15ba8bf'

// 2. Create Wagmi config using RainbowKit's default config
export const wagmiConfig = getDefaultConfig({
  appName: 'COD3.0 Hackathon',
  projectId: projectId,
  chains: [
    {
      id: 1,
      name: 'Ethereum',
      network: 'homestead',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://cloudflare-eth.com'] },
        public: { http: ['https://cloudflare-eth.com'] },
      },
      blockExplorers: {
        default: { name: 'Etherscan', url: 'https://etherscan.io' },
      },
    },
  ],
})

// 3. Create a QueryClient
export const queryClient = new QueryClient()
