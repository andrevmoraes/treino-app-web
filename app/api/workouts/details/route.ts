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
    const workoutId = searchParams.get('workout_id');

    if (!workoutId) {
      return NextResponse.json(
        { error: 'workout_id é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar treino com exercícios
    const { data: workout, error: workoutError } = await supabaseAdmin
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single();

    if (workoutError) {
      console.error('Erro ao buscar treino:', workoutError);
      return NextResponse.json(
        { error: workoutError.message || 'Erro ao buscar treino' },
        { status: 500 }
      );
    }

    // Buscar exercícios do treino
    const { data: exercises, error: exercisesError } = await supabaseAdmin
      .from('exercises')
      .select('*')
      .eq('workout_id', workoutId)
      .order('order_index', { ascending: true });

    if (exercisesError) {
      console.error('Erro ao buscar exercícios:', exercisesError);
      return NextResponse.json(
        { error: exercisesError.message || 'Erro ao buscar exercícios' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        ...workout,
        exercises: exercises || [],
      },
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar treino' },
      { status: 500 }
    );
  }
}
