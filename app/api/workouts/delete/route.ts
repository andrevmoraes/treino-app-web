import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get('workout_id');

    if (!workoutId) {
      return NextResponse.json(
        { error: 'workout_id é obrigatório' },
        { status: 400 }
      );
    }

    // Primeiro, deletar todos os exercícios associados ao workout
    const { error: exercisesError } = await supabaseAdmin
      .from('exercises')
      .delete()
      .eq('workout_id', workoutId);

    if (exercisesError) {
      console.error('Erro ao deletar exercícios:', exercisesError);
      return NextResponse.json(
        { error: 'Erro ao deletar exercícios do treino' },
        { status: 500 }
      );
    }

    // Depois, deletar o workout
    const { error: workoutError } = await supabaseAdmin
      .from('workouts')
      .delete()
      .eq('id', workoutId);

    if (workoutError) {
      console.error('Erro ao deletar workout:', workoutError);
      return NextResponse.json(
        { error: 'Erro ao deletar treino' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Treino deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro no endpoint delete workout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
