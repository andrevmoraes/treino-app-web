import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Categorização automática baseada em palavras-chave
function categorizeExercise(title: string, description: string): {
  category: string;
  muscle_group: string;
  difficulty: string;
} {
  const text = `${title} ${description}`.toLowerCase();

  let category = 'geral';
  let muscle_group = '';

  if (text.match(/supino|crucifixo|flexão|peito|peitoral|chest|press/)) {
    category = 'peito';
    muscle_group = 'Peitoral';
  } else if (text.match(/remada|puxada|pull|costas|dorsal|lat/)) {
    category = 'costas';
    muscle_group = 'Dorsais';
  } else if (text.match(/agachamento|leg press|cadeira extensora|cadeira flexora|stiff|afundo|pernas|quadríceps|posterior/)) {
    category = 'pernas';
    muscle_group = 'Quadríceps/Posteriores';
  } else if (text.match(/desenvolvimento|elevação lateral|elevação frontal|ombro|shoulder|deltoide/)) {
    category = 'ombros';
    muscle_group = 'Deltoides';
  } else if (text.match(/rosca|tríceps|bíceps|braço|curl|triceps|biceps/)) {
    category = 'braços';
    muscle_group = 'Bíceps/Tríceps';
  } else if (text.match(/abdominal|prancha|core|oblíquo|supra/)) {
    category = 'core';
    muscle_group = 'Abdômen';
  }

  // Dificuldade baseada em palavras-chave
  let difficulty = 'intermediário';
  if (text.match(/iniciante|básico|simples/)) {
    difficulty = 'iniciante';
  } else if (text.match(/avançado|complexo|intenso/)) {
    difficulty = 'avançado';
  }

  return { category, muscle_group, difficulty };
}

async function getChannelId(channelHandle: string): Promise<string> {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelHandle}&key=${YOUTUBE_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('Canal não encontrado');
  }

  return data.items[0].snippet.channelId;
}

async function fetchYouTubeVideos(channelId: string) {
  const videos = [];
  let nextPageToken = '';
  let page = 0;
  const maxPages = 5; // Limita a 5 páginas (250 vídeos)

  while (page < maxPages) {
    const url = `https://www.googleapis.com/youtube/v3/search?` +
      `key=${YOUTUBE_API_KEY}` +
      `&channelId=${channelId}` +
      `&part=snippet` +
      `&order=date` +
      `&maxResults=50` +
      `&type=video` +
      (nextPageToken ? `&pageToken=${nextPageToken}` : '');

    const response = await fetch(url);
    const data = await response.json();

    if (data.items) {
      videos.push(...data.items);
    }

    if (!data.nextPageToken) break;
    nextPageToken = data.nextPageToken;
    page++;
  }

  return videos;
}

export async function POST(request: NextRequest) {
  try {
    const { professor_id } = await request.json();

    if (!professor_id) {
      return NextResponse.json(
        { success: false, error: 'professor_id é obrigatório' },
        { status: 400 }
      );
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'YouTube API Key não configurada' },
        { status: 500 }
      );
    }

    // Buscar channel ID do canal @MaddaloniPersonal
    console.log('🔍 Buscando channel ID...');
    const channelId = await getChannelId('@MaddaloniPersonal');
    console.log(`✅ Channel ID: ${channelId}`);

    // Buscar vídeos
    console.log('📹 Buscando vídeos...');
    const videos = await fetchYouTubeVideos(channelId);
    console.log(`✅ Encontrados ${videos.length} vídeos`);

    let imported = 0;
    let skipped = 0;

    for (const video of videos) {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const description = video.snippet.description || '';
      const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Verificar se já existe
      const { data: existing } = await supabase
        .from('exercise_templates')
        .select('id')
        .eq('professor_id', professor_id)
        .eq('video_url', videoUrl)
        .single();

      if (existing) {
        skipped++;
        continue;
      }

      // Categorizar
      const { category, muscle_group, difficulty } = categorizeExercise(title, description);

      // Inserir
      const { error } = await supabase.from('exercise_templates').insert({
        professor_id,
        name: title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        category,
        muscle_group,
        difficulty,
        default_sets: 3,
        default_reps: 12,
        default_rest: '90s',
        is_active: true,
      });

      if (!error) {
        imported++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total: videos.length,
        imported,
        skipped,
      },
    });
  } catch (error: any) {
    console.error('Erro na sincronização:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
