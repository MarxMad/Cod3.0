'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WalletAuthProps {
  onAuthSuccess: (address: string, sessionToken: string) => void;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export default function WalletAuth({ onAuthSuccess }: WalletAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);

  useEffect(() => {
    // Verificar si MetaMask está instalado
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask no está instalado. Por favor, instálalo desde https://metamask.io');
      return;
    }

    try {
      setIsConnecting(true);
      setError('');

      // Solicitar acceso a la cuenta
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        setError('No se pudo conectar a la wallet');
        return;
      }

      const address = accounts[0];
      console.log('🔗 Wallet conectada:', address);

      // Generar mensaje para firmar
      const message = `Autenticación COD3.0 Admin Panel\n\nWallet: ${address}\nTimestamp: ${Date.now()}\n\nFirma este mensaje para acceder al panel de administración.`;
      
      // Solicitar firma
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      console.log('✍️ Firma generada:', signature);

      // Verificar con el servidor
      const response = await fetch('/api/auth/verify-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          signature,
          address,
        }),
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
      console.error('❌ Error conectando wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error conectando la wallet';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isWalletInstalled) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-gray-900 p-8 rounded-2xl border-2 border-red-500">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              MetaMask Requerido
            </h1>
            <p className="text-gray-300 mb-6">
              Para acceder al panel de administración necesitas tener MetaMask instalado.
            </p>
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              📥 Instalar MetaMask
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="bg-gray-900 p-8 rounded-2xl border-2 border-green-400">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-green-400 mb-4">
            Panel de Administración
          </h1>
          <p className="text-gray-300 mb-6">
            Conecta tu wallet para acceder al panel de administración de emails.
            Solo las wallets autorizadas pueden acceder.
          </p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-black font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Conectando...
              </div>
            ) : (
              '🔗 Conectar Wallet'
            )}
          </button>
          
          <div className="mt-6 text-sm text-gray-400">
            <p>🔒 Tu wallet debe estar en la lista de administradores autorizados</p>
            <p>✍️ Se te pedirá firmar un mensaje para verificar tu identidad</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
