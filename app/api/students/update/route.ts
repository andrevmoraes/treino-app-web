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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do aluno é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('students')
      .update({ 
        name: name || null, 
        phone: phone || null 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar aluno:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
