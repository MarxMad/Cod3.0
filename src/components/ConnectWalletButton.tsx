'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

interface ConnectWalletButtonProps {
  className?: string;
  showBalance?: boolean;
}

export default function ConnectWalletButton({ 
  className = '', 
  showBalance = false
}: ConnectWalletButtonProps) {

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
