import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { exercise_id, title, sets, reps, rest } = body;

    console.log('✏️ Atualizando exercício:', { exercise_id, title, sets, reps, rest });

    // Validação
    if (!exercise_id) {
      return NextResponse.json(
        { error: 'exercise_id é obrigatório' },
        { status: 400 }
      );
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (sets !== undefined) updateData.sets = parseInt(sets, 10);
    if (reps !== undefined) updateData.reps = parseInt(reps, 10);
    if (rest !== undefined) updateData.rest = rest;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      );
    }

    updateData.updated_at = new Date().toISOString();

    // Atualizar exercício
    const { data, error } = await supabaseAdmin
      .from('exercises')
      .update(updateData)
      .eq('id', exercise_id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar exercício:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar exercício' },
        { status: 500 }
      );
    }

    console.log('✅ Exercício atualizado com sucesso:', data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erro no endpoint update exercise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
