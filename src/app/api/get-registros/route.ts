import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('📊 Obteniendo registros de la base de datos...');
    
    const { data: registros, error } = await supabase
      .from('registros_hackathon')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error obteniendo registros:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error obteniendo registros de la base de datos',
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    console.log(`✅ Registros obtenidos: ${registros?.length || 0}`);
    
    return NextResponse.json({
      success: true,
      data: registros,
      count: registros?.length || 0
    });
    
  } catch (error) {
    console.error('❌ Error en get-registros:', error);
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

export async function POST(request: NextRequest) {
  try {
    const { filters } = await request.json();
    
    console.log('📊 Obteniendo registros con filtros...', filters);
    
    let query = supabase
      .from('registros_hackathon')
      .select('*');
    
    // Aplicar filtros si existen
    if (filters) {
      if (filters.experiencia) {
        query = query.eq('experiencia', filters.experiencia);
      }
      if (filters.equipo) {
        query = query.eq('equipo', filters.equipo);
      }
      if (filters.universidad) {
        query = query.ilike('universidad', `%${filters.universidad}%`);
      }
      if (filters.fecha_desde) {
        query = query.gte('created_at', filters.fecha_desde);
      }
      if (filters.fecha_hasta) {
        query = query.lte('created_at', filters.fecha_hasta);
      }
    }
    
    const { data: registros, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error obteniendo registros filtrados:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error obteniendo registros filtrados',
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    console.log(`✅ Registros filtrados obtenidos: ${registros?.length || 0}`);
    
    return NextResponse.json({
      success: true,
      data: registros,
      count: registros?.length || 0,
      filters: filters
    });
    
  } catch (error) {
    console.error('❌ Error en get-registros con filtros:', error);
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
