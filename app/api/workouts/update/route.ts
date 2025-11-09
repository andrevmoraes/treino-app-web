import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { workout_id, name, description, color } = body;

    // Validação
    if (!workout_id) {
      return NextResponse.json(
        { error: 'workout_id é obrigatório' },
        { status: 400 }
      );
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      );
    }

    updateData.updated_at = new Date().toISOString();

    // Atualizar workout
    const { data, error } = await supabaseAdmin
      .from('workouts')
      .update(updateData)
      .eq('id', workout_id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar workout:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar treino' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erro no endpoint update workout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
