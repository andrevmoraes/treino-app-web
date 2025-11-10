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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const studentId = formData.get('studentId') as string;

    if (!file || !studentId) {
      return NextResponse.json(
        { error: 'Arquivo e ID do aluno são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload para Supabase Storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('student-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      return NextResponse.json(
        { error: 'Erro ao fazer upload da imagem' },
        { status: 500 }
      );
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('student-photos')
      .getPublicUrl(filePath);

    // Atualizar avatar_url no banco
    const { error: updateError } = await supabaseAdmin
      .from('students')
      .update({ avatar_url: publicUrl })
      .eq('id', studentId);

    if (updateError) {
      console.error('Erro ao atualizar avatar_url:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({ photoUrl: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
