/**
 * Script para importar vídeos do canal do YouTube para biblioteca de exercícios
 * 
 * REQUISITOS:
 * 1. Criar uma API Key do YouTube Data API v3
 *    - Acesse: https://console.cloud.google.com/
 *    - Ative "YouTube Data API v3"
 *    - Crie credenciais (API Key)
 * 
 * 2. Adicione a API Key no .env.local:
 *    YOUTUBE_API_KEY=sua_api_key_aqui
 * 
 * 3. Execute: node import-youtube-videos.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCxYourChannelIdHere'; // Precisa extrair do URL

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!YOUTUBE_API_KEY) {
  console.error('❌ Missing YOUTUBE_API_KEY in .env.local');
  console.log('\n📝 Para obter uma API Key:');
  console.log('1. Acesse: https://console.cloud.google.com/');
  console.log('2. Ative "YouTube Data API v3"');
  console.log('3. Crie credenciais (API Key)');
  console.log('4. Adicione no .env.local: YOUTUBE_API_KEY=sua_key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Extrair Channel ID do URL do canal
async function getChannelId(channelUrl) {
  // Canal: https://www.youtube.com/@MaddaloniPersonal
  const username = channelUrl.split('@')[1]?.split('/')[0];
  
  if (!username) {
    throw new Error('URL inválida do canal');
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${username}&key=${YOUTUBE_API_KEY}`
  );

  const data = await response.json();
  
  if (data.items && data.items.length > 0) {
    return data.items[0].id;
  }
  
  throw new Error('Canal não encontrado');
}

// Buscar vídeos do canal (Shorts)
async function fetchYouTubeShorts(channelId, maxResults = 50) {
  console.log(`🔍 Buscando vídeos do canal ${channelId}...`);

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${channelId}&maxResults=${maxResults}&type=video&videoDuration=short&key=${YOUTUBE_API_KEY}`
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.items.map(item => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt,
  }));
}

// Categorizar exercício baseado no título
function categorizeExercise(title) {
  const titleLower = title.toLowerCase();

  // Categorias por palavra-chave
  const categories = {
    peito: ['supino', 'peitoral', 'peito', 'flexão', 'fly'],
    costas: ['puxada', 'remada', 'dorsal', 'costas', 'barra fixa'],
    pernas: ['agachamento', 'leg', 'coxa', 'glúteo', 'panturrilha', 'stiff'],
    ombros: ['ombro', 'desenvolvimento', 'elevação lateral', 'elevação frontal'],
    braços: ['rosca', 'tríceps', 'bíceps', 'tríceps', 'curl'],
    core: ['abdominal', 'prancha', 'core', 'oblíquo'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return category;
    }
  }

  return 'geral';
}

// Importar vídeos para o Supabase
async function importVideos(professorId) {
  try {
    console.log('🚀 Iniciando importação de vídeos do YouTube...\n');

    // 1. Obter Channel ID
    const channelId = await getChannelId('https://www.youtube.com/@MaddaloniPersonal');
    console.log(`✅ Channel ID: ${channelId}\n`);

    // 2. Buscar vídeos
    const videos = await fetchYouTubeShorts(channelId);
    console.log(`✅ Encontrados ${videos.length} vídeos\n`);

    // 3. Inserir no banco
    let imported = 0;
    let skipped = 0;

    for (const video of videos) {
      const category = categorizeExercise(video.title);
      
      const { error } = await supabase
        .from('exercise_templates')
        .insert({
          professor_id: professorId,
          name: video.title,
          description: video.description || null,
          video_url: `https://www.youtube.com/watch?v=${video.videoId}`,
          thumbnail_url: video.thumbnail,
          category: category,
          default_sets: 3,
          default_reps: 12,
          default_rest: '90s',
        });

      if (error) {
        console.log(`⚠️  Erro ao importar: ${video.title}`);
        skipped++;
      } else {
        console.log(`✅ Importado: ${video.title} [${category}]`);
        imported++;
      }
    }

    console.log(`\n🎉 Importação concluída!`);
    console.log(`   ✅ Importados: ${imported}`);
    console.log(`   ⚠️  Ignorados: ${skipped}`);
  } catch (error) {
    console.error('❌ Erro na importação:', error.message);
  }
}

// Executar
const PROFESSOR_ID = process.argv[2];

if (!PROFESSOR_ID) {
  console.error('❌ Uso: node import-youtube-videos.js <professor_id>');
  console.log('\nExemplo:');
  console.log('  node import-youtube-videos.js 123e4567-e89b-12d3-a456-426614174000\n');
  process.exit(1);
}

importVideos(PROFESSOR_ID);
