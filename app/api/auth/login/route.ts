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

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar aluno por telefone
    const { data: students, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('phone', phone)
      .eq('active', true)
      .limit(1);

    if (error) {
      console.error('Erro ao buscar aluno:', error);
      return NextResponse.json(
        { error: error.message || 'Erro ao buscar aluno' },
        { status: 500 }
      );
    }

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: 'Aluno não encontrado. Entre em contato com seu professor para se cadastrar.' },
        { status: 404 }
      );
    }

    const student = students[0];

    return NextResponse.json({ data: student });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno ao fazer login' },
      { status: 500 }
    );
  }
}
