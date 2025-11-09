import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exercise_id');

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'exercise_id é obrigatório' },
        { status: 400 }
      );
    }

    console.log('🗑️ Deletando exercício:', exerciseId);

    // Deletar o exercício
    const { error } = await supabaseAdmin
      .from('exercises')
      .delete()
      .eq('id', exerciseId);

    if (error) {
      console.error('❌ Erro ao deletar exercício:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar exercício' },
        { status: 500 }
      );
    }

    console.log('✅ Exercício deletado com sucesso');
    return NextResponse.json({ 
      success: true,
      message: 'Exercício deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro no endpoint delete exercise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
