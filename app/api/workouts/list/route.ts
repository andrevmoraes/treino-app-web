import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'student_id é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar treinos do aluno
    const { data: workouts, error } = await supabaseAdmin
      .from('workouts')
      .select('*')
      .eq('student_id', studentId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erro ao buscar treinos:', error);
      return NextResponse.json(
        { error: error.message || 'Erro ao buscar treinos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: workouts });
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar treinos' },
      { status: 500 }
    );
  }
}
