const fs = require('fs');
const content = `
import { Injectable, Logger, HttpException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeganodesService {
  private readonly logger = new Logger(MeganodesService.name);

  private readonly apiUrl = process.env.MEGANODES_API_URL || 'https://api-prd-v2.meganodes.net';
  private readonly apiToken = process.env.MEGANODES_API_TOKEN || '123qwe!@#QWE';

  constructor(private readonly prisma: PrismaService) {}

  private async makeRequest(endpoint: string, data: any = {}) {
    const url = \`\${this.apiUrl}\${endpoint}\`;
    const headers = {
      'Authorization': \`Bearer \${this.apiToken}\`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      const resData = await response.json();
      
      if (resData.code !== 0) {
        throw new Error(resData.message || 'Meganodes API Error');
      }
      
      return resData.data;
    } catch (error) {
      this.logger.error(\`Meganodes API Error (\${endpoint}): \${error.message}\`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOrProvisionUser(userId: string): Promise<number> {
    const settingKey = \`mn_id_\${userId}\`;
    
    // Check if we already have the mapping
    const existing = await this.prisma.systemSetting.findUnique({ where: { key: settingKey } });
    if (existing) {
      return parseInt(existing.value, 10);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const cleanUsername = (user.username || \`user_\${user.player_id}\`).replace(/[^a-zA-Z0-9_.]/g, '').substring(0, 50);

    let userCode: number;
    try {
      const res = await this.makeRequest('/user/create', { name: cleanUsername });
      userCode = res.user_code;
    } catch (e) {
      this.logger.error("Failed to create Meganodes user: " + e.message);
      throw new Error("Could not provision Meganodes user: " + e.message);
    }

    // Save mapping in both directions
    await this.prisma.$transaction([
      this.prisma.systemSetting.create({ data: { key: settingKey, value: userCode.toString(), description: 'Meganodes User Code' } }),
      this.prisma.systemSetting.create({ data: { key: \`mn_u_\${userCode}\`, value: userId, description: 'Meganodes User ID mapping' } })
    ]);

    return userCode;
  }

  async resolveUserIdFromCode(userCode: number): Promise<string> {
    const key = \`mn_u_\${userCode}\`;
    const setting = await this.prisma.systemSetting.findUnique({ where: { key } });
    if (setting) return setting.value;

    // Fallback: Ask Meganodes for the username, then find our user
    try {
      const info = await this.makeRequest('/user/info', { user_code: userCode });
      const username = info.name;
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (user) {
        // Save it for next time
        await this.prisma.systemSetting.create({ data: { key, value: user.id, description: 'Meganodes User ID mapping' } });
        await this.prisma.systemSetting.upsert({
          where: { key: \`mn_id_\${user.id}\` },
          create: { key: \`mn_id_\${user.id}\`, value: userCode.toString(), description: 'Meganodes User Code' },
          update: { value: userCode.toString() }
        });
        return user.id;
      }
    } catch (e) {
      this.logger.error("Could not resolve user code fallback: " + e.message);
    }
    throw new Error('User could not be resolved from code: ' + userCode);
  }

  async initGame(userId: string, providerCode: number, gameSymbol: string, lang: string = 'en') {
    const userCode = await this.getOrProvisionUser(userId);

    const data = {
      user_code: userCode,
      provider_code: Number(providerCode),
      game_symbol: gameSymbol,
      lang: lang,
      return_url: process.env.FRONTEND_URL || 'https://8111c.com/'
    };

    const res = await this.makeRequest('/game/game-url', data);
    return res.launch_url;
  }
}
`;
fs.writeFileSync('meganodes.service.ts', content);
console.log('Created meganodes.service.ts locally');
