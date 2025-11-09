import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      professor_id,
      name,
      description,
      video_url,
      thumbnail_url,
      category,
      muscle_group,
      equipment,
      difficulty,
      default_sets,
      default_reps,
      default_rest,
      tip,
    } = body;

    // Validação
    if (!professor_id || !name) {
      return NextResponse.json(
        { error: 'professor_id e name são obrigatórios' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('exercise_templates')
      .insert({
        professor_id,
        name,
        description: description || null,
        video_url: video_url || null,
        thumbnail_url: thumbnail_url || null,
        category: category || null,
        muscle_group: muscle_group || null,
        equipment: equipment || null,
        difficulty: difficulty || null,
        default_sets: default_sets || 3,
        default_reps: default_reps || 12,
        default_rest: default_rest || '90s',
        tip: tip || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar template:', error);
      return NextResponse.json(
        { error: 'Erro ao criar exercício na biblioteca' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro no endpoint create:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
