import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { isWalletAuthorized } from '@/config/admin-wallets';

export async function POST(request: NextRequest) {
  try {
    const { message, signature, address } = await request.json();
    
    console.log('🔐 Verificando wallet:', address);
    console.log('📝 Mensaje:', message);
    console.log('✍️ Firma:', signature);
    
    // Verificar que la wallet esté en la lista de admins
    if (!isWalletAuthorized(address)) {
      console.log('❌ Wallet no autorizada:', address);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Wallet no autorizada para acceder al panel de administración',
          code: 'UNAUTHORIZED_WALLET'
        },
        { status: 403 }
      );
    }
    
    // Verificar la firma
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        console.log('❌ Firma inválida');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Firma inválida',
            code: 'INVALID_SIGNATURE'
          },
          { status: 401 }
        );
      }
      
      console.log('✅ Wallet verificada correctamente:', address);
      
      // Generar token de sesión (opcional, para mantener la sesión)
      const sessionToken = Buffer.from(`${address}-${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        success: true,
        message: 'Autenticación exitosa',
        address: address,
        sessionToken: sessionToken,
        isAdmin: true
      });
      
    } catch (signatureError) {
      console.error('❌ Error verificando firma:', signatureError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error verificando la firma',
          code: 'SIGNATURE_ERROR'
        },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('❌ Error en verificación de wallet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
