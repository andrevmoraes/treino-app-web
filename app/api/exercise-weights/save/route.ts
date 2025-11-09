import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, exercise_id, weight, unit = 'kg', notes } = body;

    // Validação
    if (!student_id || !exercise_id || weight === undefined || weight === null) {
      return NextResponse.json(
        { error: 'student_id, exercise_id e weight são obrigatórios' },
        { status: 400 }
      );
    }

    if (weight < 0) {
      return NextResponse.json(
        { error: 'Peso deve ser maior ou igual a zero' },
        { status: 400 }
      );
    }

    // Inserir peso
    const { data, error } = await supabase
      .from('exercise_weights')
      .insert({
        student_id,
        exercise_id,
        weight: parseFloat(weight),
        unit,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar peso:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar peso do exercício' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro no endpoint save:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
