'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';

interface RainbowKitAuthProps {
  onAuthSuccess: (address: string, sessionToken: string) => void;
}

export default function RainbowKitAuth({ onAuthSuccess }: RainbowKitAuthProps) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleAuthentication = useCallback(async () => {
    if (!address) return;

    setError('');
    setIsAuthenticating(true);

    try {
      console.log('🔗 Wallet conectada:', address);

      // Generar mensaje para firmar
      const message = `Autenticación COD3.0 Admin Panel\n\nWallet: ${address}\nTimestamp: ${Date.now()}\n\nFirma este mensaje para acceder al panel de administración.`;

      // Firmar el mensaje usando wagmi
      const signature = await signMessageAsync({ message });

      console.log('✍️ Mensaje firmado:', signature);

      // Enviar firma al backend para verificación
      const response = await fetch('/api/auth/verify-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature, address }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Autenticación exitosa');
        onAuthSuccess(address, data.sessionToken);
      } else {
        setError(data.error || 'Error en la autenticación');
        console.error('❌ Error de autenticación:', data.error);
      }
    } catch (err: unknown) {
      console.error('❌ Error en la autenticación:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error en la autenticación';
      setError(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, signMessageAsync, onAuthSuccess]);

  // Verificar autenticación cuando se conecte la wallet
  useEffect(() => {
    if (isConnected && address) {
      handleAuthentication();
    }
  }, [isConnected, address, handleAuthentication]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md border border-green-500"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Panel de Administración
          </h2>
          <p className="text-gray-300 text-sm">
            COD3.0 HACKATHON
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Conecta tu wallet para acceder a las herramientas de gestión del hackathon.
          </p>
          
          <div className="flex justify-center">
            <ConnectButton 
              showBalance={false}
              chainStatus="none"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>
        </div>

        {isAuthenticating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-400 text-sm">Verificando wallet...</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-900/30 rounded-lg border border-red-500"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>🔐 Solo wallets autorizadas pueden acceder</p>
          <p>✨ Soporta MetaMask, WalletConnect y más</p>
        </div>
      </motion.div>
    </div>
  );
}
