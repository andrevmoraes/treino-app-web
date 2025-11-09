import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const exercise_id = searchParams.get('exercise_id');

    // Validação
    if (!student_id || !exercise_id) {
      return NextResponse.json(
        { error: 'student_id e exercise_id são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar último peso usado neste exercício por este aluno
    const { data, error } = await supabase
      .from('exercise_weights')
      .select('*')
      .eq('student_id', student_id)
      .eq('exercise_id', exercise_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar peso:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar peso do exercício' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: data || null // null se nunca registrou peso
    });
  } catch (error) {
    console.error('Erro no endpoint get:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
