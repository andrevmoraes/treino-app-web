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
    const professorId = searchParams.get('professor_id');

    if (!professorId) {
      return NextResponse.json(
        { error: 'professor_id é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar alunos do professor
    const { data: students, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('professor_id', professorId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar alunos:', error);
      return NextResponse.json(
        { error: error.message || 'Erro ao buscar alunos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: students });
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar alunos' },
      { status: 500 }
    );
  }
}
