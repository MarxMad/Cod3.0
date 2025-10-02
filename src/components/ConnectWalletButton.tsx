'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

interface ConnectWalletButtonProps {
  className?: string;
  showBalance?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConnectWalletButton({ 
  className = '', 
  showBalance = false,
  size = 'md'
}: ConnectWalletButtonProps) {
  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <ConnectButton
        showBalance={showBalance}
        chainStatus="none"
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
        label="Conectar Wallet"
      />
    </motion.div>
  );
}
