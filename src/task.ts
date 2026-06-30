import 'dotenv/config';
import axios from 'axios';

const {
  JSONBIN_API_KEY,
  JSONBIN_ID_SUBS,
  APP_API_URL,
  APP_API_TOKEN,
} = process.env;

async function main() {
  if (!JSONBIN_API_KEY || !JSONBIN_ID_SUBS || !APP_API_URL || !APP_API_TOKEN) {
    throw new Error(
      'Missing required env vars: JSONBIN_API_KEY, JSONBIN_ID_SUBS, APP_API_URL, APP_API_TOKEN',
    );
  }

  const { data: bin } = await axios.get(
    `https://api.jsonbin.io/v3/b/${JSONBIN_ID_SUBS}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
      },
    },
  );

  const record: unknown[] = bin.record;
  if (!Array.isArray(record)) {
    throw new Error(`JSONBin retornou formato inesperado: ${JSON.stringify(bin)}`);
  }
  console.log(`JSONBin: ${record.length} vídeos encontrados`);

  const { data } = await axios.post(
    `${APP_API_URL}/v1/video/refresh`,
    { record },
    { headers: { Authorization: `Bearer ${APP_API_TOKEN}` } },
  );

  const { videosAdded, videosFounded, errors } = data;
  console.log(
    `Adicionados: ${videosAdded.length} | Já existiam: ${videosFounded.length} | Erros: ${errors.length}`,
  );

  if (errors.length > 0) {
    //console.error('Erros:', JSON.stringify(errors, null, 2));
    //process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err?.response?.data ?? err.message);
    process.exit(1);
  });
