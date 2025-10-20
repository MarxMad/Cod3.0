'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ReownAuthProps {
  onAuthSuccess: (user: Record<string, unknown>) => void;
}

export default function ReownAuth({ onAuthSuccess }: ReownAuthProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const checkUserRegistration = useCallback(async (walletAddress: string) => {
    setLoading(true);
    try {
      // Usar la instancia de supabase importada
      
      // Buscar usuario por wallet address
      const { data, error } = await supabase
        .from('registros_hackathon')
        .select('*')
        .eq('email', walletAddress) // Asumiendo que usamos email como identificador
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user:', error);
        return;
      }

      if (data) {
        setUser(data);
        onAuthSuccess(data);
      } else {
        // Usuario no registrado, mostrar mensaje
        alert('No estás registrado en el hackathon. Por favor regístrate primero.');
        disconnect();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [onAuthSuccess]);

  useEffect(() => {
    if (isConnected && address) {
      checkUserRegistration(address);
    }
  }, [isConnected, address, checkUserRegistration]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        <span className="ml-2 text-white">Verificando registro...</span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <ConnectButton />
      {isConnected && user && (
        <div className="mt-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
          <p className="text-green-400 font-semibold">
            ¡Bienvenido, {String((user as Record<string, unknown>)?.nombre || 'Usuario')}!
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Conectado con: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}
