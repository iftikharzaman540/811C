import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const merchantId = process.env.SLOTEGRATOR_MERCHANT_ID || '92a8b0548bc3c5f12edd81b6cabdbec6';
const merchantKey = process.env.SLOTEGRATOR_MERCHANT_KEY || '3e2717b893aa315346d07abefaad335cc5e3239a';
const apiUrl = process.env.SLOTEGRATOR_API_URL || 'https://staging.slotegrator.com/api/index.php/v1';

function generateSignature(params) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const requestParams = { ...params, 'X-Merchant-Id': merchantId, 'X-Timestamp': timestamp, 'X-Nonce': nonce };
  const sortedKeys = Object.keys(requestParams).sort();
  const signString = sortedKeys.map(key => `${key}=${requestParams[key]}`).join('&');
  const signature = crypto.createHmac('sha1', merchantKey).update(signString).digest('hex');
  return { signature, nonce, timestamp };
}

async function seed() {
  console.log('Fetching games from Slotegrator...');
  const { signature, nonce, timestamp } = generateSignature({});
  
  try {
    const res = await axios.get(`${apiUrl}/games?expand=tags`, {
      headers: {
        'X-Merchant-Id': merchantId,
        'X-Timestamp': timestamp,
        'X-Nonce': nonce,
        'X-Sign': signature,
      }
    });

    const games = res.data.items;
    if (!games || games.length === 0) {
      console.log('No games found!');
      return;
    }

    console.log(`Found ${games.length} games. Saving to database...`);
    
    // Create a dummy category
    const category = await prisma.gameCategory.upsert({
      where: { slug: 'slots' },
      update: {},
      create: { name: 'Slots', slug: 'slots', status: 'ACTIVE' }
    });

    let count = 0;
    for (const game of games) {
      await prisma.game.upsert({
        where: { provider_game_id: game.uuid },
        update: {
          name: game.name,
          thumbnail: game.image,
          status: 'ACTIVE'
        },
        create: {
          name: game.name,
          slug: game.uuid, // Using UUID as slug for simplicity
          thumbnail: game.image,
          provider: game.provider || 'slotegrator',
          provider_game_id: game.uuid,
          category_id: category.id,
          status: 'ACTIVE',
          is_featured: true
        }
      });
      count++;
    }
    console.log(`Successfully seeded ${count} games!`);
  } catch (err) {
    console.error('Error seeding games:', err?.response?.data || err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
