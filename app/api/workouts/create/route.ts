import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, name, description, color } = body;

    console.log('📝 Criando workout:', { student_id, name, description, color });

    // Validação
    if (!student_id || !name || !description || !color) {
      console.error('❌ Validação falhou:', { student_id, name, description, color });
      return NextResponse.json(
        { error: 'Campos obrigatórios: student_id, name, description, color' },
        { status: 400 }
      );
    }

    // Buscar o próximo order_index disponível para o aluno
    const { data: existingWorkouts, error: fetchError } = await supabaseAdmin
      .from('workouts')
      .select('order_index')
      .eq('student_id', student_id)
      .order('order_index', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('❌ Erro ao buscar workouts existentes:', fetchError);
      return NextResponse.json(
        { error: 'Erro ao verificar treinos existentes' },
        { status: 500 }
      );
    }

    const nextOrderIndex = existingWorkouts && existingWorkouts.length > 0
      ? existingWorkouts[0].order_index + 1
      : 0;

    console.log('📊 Próximo order_index:', nextOrderIndex);

    // Criar workout
    const { data, error } = await supabaseAdmin
      .from('workouts')
      .insert({
        student_id,
        name,
        description,
        color,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar workout:', error);
      return NextResponse.json(
        { error: 'Erro ao criar treino', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Workout criado com sucesso:', data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Erro no endpoint create workout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
