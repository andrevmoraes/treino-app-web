import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Usar service_role key para bypass RLS (somente server-side)
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
    const { name, phone, professor_id } = await request.json();

    if (!name || !phone || !professor_id) {
      return NextResponse.json(
        { error: 'Nome, telefone e professor_id são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe aluno com esse telefone
    const { data: existing } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Já existe um aluno cadastrado com este telefone' },
        { status: 400 }
      );
    }

    // Criar aluno (bypass RLS com service_role)
    const { data: student, error } = await supabaseAdmin
      .from('students')
      .insert({
        name,
        phone,
        professor_id,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar aluno:', error);
      return NextResponse.json(
        { error: error.message || 'Erro ao cadastrar aluno' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: student });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao cadastrar aluno' },
      { status: 500 }
    );
  }
}
