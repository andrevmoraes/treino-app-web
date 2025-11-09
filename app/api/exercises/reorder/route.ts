import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { exercises } = body;

    console.log('🔄 Reordenando exercícios:', exercises);

    // Validação
    if (!exercises || !Array.isArray(exercises)) {
      return NextResponse.json(
        { error: 'exercises deve ser um array' },
        { status: 400 }
      );
    }

    // Estratégia: primeiro setar todos para valores negativos (temporários)
    // depois atualizar para os valores corretos
    
    // Passo 1: Setar valores temporários (negativos) para evitar conflito de constraint
    const tempUpdates = exercises.map((exercise: { id: string; order_index: number }, idx: number) =>
      supabaseAdmin
        .from('exercises')
        .update({ order_index: -(idx + 1) }) // Valores negativos temporários
        .eq('id', exercise.id)
    );

    const tempResults = await Promise.all(tempUpdates);
    const tempErrors = tempResults.filter(result => result.error);
    
    if (tempErrors.length > 0) {
      console.error('❌ Erro no passo temporário:', tempErrors.map(e => e.error));
      return NextResponse.json(
        { error: 'Erro ao reordenar exercícios (passo 1)' },
        { status: 500 }
      );
    }

    // Passo 2: Atualizar para os valores finais corretos
    const finalUpdates = exercises.map((exercise: { id: string; order_index: number }) =>
      supabaseAdmin
        .from('exercises')
        .update({ order_index: exercise.order_index })
        .eq('id', exercise.id)
    );

    const finalResults = await Promise.all(finalUpdates);
    const finalErrors = finalResults.filter(result => result.error);

    if (finalErrors.length > 0) {
      console.error('❌ Erro no passo final:', finalErrors.map(e => e.error));
      return NextResponse.json(
        { error: 'Erro ao reordenar exercícios (passo 2)' },
        { status: 500 }
      );
    }

    console.log('✅ Exercícios reordenados com sucesso');
    return NextResponse.json({ 
      success: true,
      message: 'Exercícios reordenados com sucesso' 
    });
  } catch (error) {
    console.error('Erro no endpoint reorder exercises:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
