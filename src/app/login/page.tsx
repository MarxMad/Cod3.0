'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Shield, Users, Trophy, Mail, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'wallet' | 'email'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const checkUserRegistration = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Usar la instancia de supabase importada
      
      // Buscar usuario por wallet address
      const { data, error } = await supabase
        .from('registros_hackathon')
        .select('*')
        .eq('email', address)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user:', error);
        setError('Error al verificar el registro');
        return;
      }

      if (data) {
        // Usuario registrado, redirigir al dashboard
        router.push('/dashboard');
      } else {
        // Usuario no registrado
        setError('No estás registrado en el hackathon. Por favor regístrate primero.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al verificar el registro');
    } finally {
      setLoading(false);
    }
  }, [address, router]);

  const sendVerificationCode = async () => {
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    setSendingCode(true);
    setError('');

    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setCodeSent(true);
        setError('');
      } else {
        setError(data.error || 'Error enviando código');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      setError('Error enviando código');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      setError('Por favor ingresa el código');
      return;
    }

    setVerifyingCode(true);
    setError('');

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar datos del usuario en localStorage para la sesión
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authMethod', 'email');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Código inválido');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Error verificando código');
    } finally {
      setVerifyingCode(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      checkUserRegistration();
    }
  }, [isConnected, address, checkUserRegistration]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-400">
            Conecta tu wallet para acceder al dashboard
          </p>
        </div>

        {/* Auth Method Selector */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMethod === 'email'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mail className="inline h-4 w-4 mr-2" />
              Email
            </button>
            <button
              onClick={() => setAuthMethod('wallet')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMethod === 'wallet'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wallet className="inline h-4 w-4 mr-2" />
              Wallet (Admin)
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {authMethod === 'email' ? (
            <div className="space-y-4">
              {!codeSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email registrado en el hackathon
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <button
                    onClick={sendVerificationCode}
                    disabled={sendingCode}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    {sendingCode ? 'Enviando...' : 'Enviar Código'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-green-400 text-sm mb-4">
                      Código enviado a {email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Código de verificación
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <button
                    onClick={verifyCode}
                    disabled={verifyingCode}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    {verifyingCode ? 'Verificando...' : 'Verificar Código'}
                  </button>
                  <button
                    onClick={() => {
                      setCodeSent(false);
                      setCode('');
                      setEmail('');
                    }}
                    className="w-full text-gray-400 hover:text-white text-sm py-2"
                  >
                    Cambiar email
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                  <p className="text-white">Verificando registro...</p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <ConnectButton />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Solo para administradores. Al conectar tu wallet, verificaremos que estés registrado.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <Users className="h-6 w-6 text-blue-400 mr-3" />
            <div>
              <h3 className="font-semibold text-white">Dashboard Personal</h3>
              <p className="text-sm text-gray-400">Gestiona tu perfil y proyecto</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-400 mr-3" />
            <div>
              <h3 className="font-semibold text-white">Sube tu Proyecto</h3>
              <p className="text-sm text-gray-400">Comparte tu trabajo con el mundo</p>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-400">
            ¿No estás registrado?{' '}
            <Link
              href="/registro"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
