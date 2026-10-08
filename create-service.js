const fs = require('fs');
const content = `
import { Injectable, Logger, HttpException, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SlotegratorService {
  private readonly logger = new Logger(SlotegratorService.name);

  // These should ideally be in .env
  public merchantId = process.env.SLOTEGRATOR_MERCHANT_ID || 'dummy_merchant_id';
  public merchantKey = process.env.SLOTEGRATOR_MERCHANT_KEY || 'dummy_merchant_key';
  private baseUrl = process.env.SLOTEGRATOR_API_URL || 'https://api.slotegrator.com/api/v1';

  private generateXSign(params: Record<string, any>, headers: Record<string, string>): string {
    const merged = { ...params, ...headers };
    // Sort by keys
    const sortedKeys = Object.keys(merged).sort();
    
    // Build URL-encoded string
    const pairs = [];
    for (const key of sortedKeys) {
      if (merged[key] !== undefined && merged[key] !== null) {
        // Must use proper URL encoding? The docs say "Generate a URL-encoded query string from this array"
        // Wait, PHP http_build_query uses RFC 1738 (spaces as +) or RFC 3986 (spaces as %20).
        // Standard URLSearchParams does the job.
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(merged[key])));
      }
    }
    const hashString = pairs.join('&');
    
    return crypto.createHmac('sha1', this.merchantKey).update(hashString, 'utf8').digest('hex');
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST', data: Record<string, any> = {}) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');

    const headers: Record<string, string> = {
      'X-Merchant-Id': this.merchantId,
      'X-Timestamp': timestamp,
      'X-Nonce': nonce
    };

    const sign = this.generateXSign(method === 'POST' ? data : data, headers);
    headers['X-Sign'] = sign;

    let url = \`\${this.baseUrl}\${endpoint}\`;
    
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...headers,
        'Accept': 'application/json'
      }
    };

    if (method === 'POST') {
      const formBody = new URLSearchParams(data).toString();
      requestOptions.body = formBody;
      requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      if (Object.keys(data).length > 0) {
        url += '?' + new URLSearchParams(data).toString();
      }
    }

    try {
      const response = await fetch(url, requestOptions);
      const resData = await response.json();
      
      if (!response.ok) {
        throw new Error(resData.message || 'Slotegrator API Error');
      }
      
      return resData;
    } catch (error) {
      this.logger.error(\`Slotegrator API Error (\${endpoint}): \${error.message}\`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getGames() {
    return this.makeRequest('/games', 'GET', { expand: 'tags,parameters,images' });
  }

  async initGame(gameUuid: string, playerId: string, playerName: string, currency: string = 'PKR', isDemo: boolean = false) {
    const endpoint = isDemo ? '/games/init-demo' : '/games/init';
    
    // We must pass session_id for real games. We can generate a random unique session or use our DB session id.
    const sessionId = crypto.randomBytes(16).toString('hex');
    
    const data: any = {
      game_uuid: gameUuid,
      player_id: playerId,
      player_name: playerName || 'Player',
      currency,
      session_id: sessionId,
      return_url: process.env.FRONTEND_URL || 'https://8111c.com/'
    };

    const res = await this.makeRequest(endpoint, 'POST', data);
    return res.url;
  }
}
`;
fs.writeFileSync('slotegrator.service.ts', content);
console.log('Created slotegrator.service.ts locally');
