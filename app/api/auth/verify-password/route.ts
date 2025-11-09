import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password, hash } = await request.json();

    if (!password || !hash) {
      return NextResponse.json(
        { error: 'Senha e hash são obrigatórios' },
        { status: 400 }
      );
    }

    // Compara a senha com o hash
    const isValid = await bcrypt.compare(password, hash);

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return NextResponse.json(
      { error: 'Erro interno ao verificar senha' },
      { status: 500 }
    );
  }
}
