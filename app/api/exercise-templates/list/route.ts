import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professor_id = searchParams.get('professor_id');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (!professor_id) {
      return NextResponse.json(
        { error: 'professor_id é obrigatório' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('exercise_templates')
      .select('*')
      .eq('professor_id', professor_id)
      .eq('is_active', true)
      .order('usage_count', { ascending: false });

    // Filtro por categoria
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Busca por nome
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar templates:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar biblioteca de exercícios' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro no endpoint list:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
