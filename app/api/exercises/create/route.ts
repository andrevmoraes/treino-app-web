import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workout_id, title, sets, reps, rest, video, tip, template_id } = body;

    console.log('📝 Criando exercício:', { workout_id, title, sets, reps, rest, video, tip, template_id });

    // Validação
    if (!workout_id || !title || !sets || !reps || !rest) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: workout_id, title, sets, reps, rest' },
        { status: 400 }
      );
    }

    // Buscar o próximo order_index disponível para o treino
    const { data: existingExercises, error: fetchError } = await supabaseAdmin
      .from('exercises')
      .select('order_index')
      .eq('workout_id', workout_id)
      .order('order_index', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('❌ Erro ao buscar exercícios existentes:', fetchError);
      return NextResponse.json(
        { error: 'Erro ao verificar exercícios existentes' },
        { status: 500 }
      );
    }

    const nextOrderIndex = existingExercises && existingExercises.length > 0
      ? existingExercises[0].order_index + 1
      : 0;

    console.log('📊 Próximo order_index:', nextOrderIndex);

    // Criar exercício
    const { data, error } = await supabaseAdmin
      .from('exercises')
      .insert({
        workout_id,
        title,
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        rest,
        video: video || null,
        tip: tip || null,
        order_index: nextOrderIndex,
        template_id: template_id || null, // Opcional: referência ao template
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar exercício:', error);
      return NextResponse.json(
        { error: 'Erro ao criar exercício', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Exercício criado com sucesso:', data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Erro no endpoint create exercise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
