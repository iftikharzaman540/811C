import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class GregmornService {
  private readonly logger = new Logger(GregmornService.name);

  // Default to STAGE endpoints unless overriden by env
  private officeApiUrl = process.env.GREGMORN_OFFICE_API || 'https://office-api-dev.helcenac.com';
  private clientApiUrl = process.env.GREGMORN_CLIENT_API || 'https://client-api-dev.helcenac.com';

  private loginId = process.env.GREGMORN_LOGIN || '';
  private password = process.env.GREGMORN_PASSWORD || '';
  public userId = process.env.GREGMORN_USER_ID || '';
  public secretKey = process.env.GREGMORN_SECRET_KEY || '';

  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private generateSignature(bodyString: string): string {
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(bodyString, 'utf8')
      .digest('hex');
  }

  async login(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const params = new URLSearchParams();
      params.append('login', this.loginId);
      params.append('password', this.password);

      const response = await fetch(`${this.officeApiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      this.accessToken = data.accessToken;
      // Assume token is valid for a short time (e.g. 5 minutes) to be safe before refreshing
      this.tokenExpiry = Date.now() + 5 * 60 * 1000;
      
      return this.accessToken;
    } catch (error) {
      this.logger.error(`Gregmorn login error: ${error.message}`);
      throw new InternalServerErrorException('Failed to authenticate with game provider');
    }
  }

  async getGames(currency: string = 'PKR') {
    const token = await this.login();
    try {
      const response = await fetch(`${this.officeApiUrl}/users/${this.userId}/getUserGames/${currency}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch games');
      }
      return Array.isArray(data) ? data.filter((g: any) => g.isEnabled) : data;
    } catch (error) {
      this.logger.error(`Gregmorn getGames error: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch game list');
    }
  }

  async openGame(playerLogin: string, gameId: string, currency: string = 'PKR', isDemo: boolean = false) {
    // According to docs, openGame does not require access token, only X-Signature
    const payload = {
      currency,
      demo: isDemo ? "1" : "0",
      exitUrl: process.env.FRONTEND_URL || "https://8111c.com/",
      callbackUrl: "https://8111c.com/api/v1/webhooks/gregmorn",
      gameId,
      language: "en",
      player_login: playerLogin,
      user_id: this.userId
    };

    const bodyString = JSON.stringify(payload);
    const signature = this.generateSignature(bodyString);

    try {
      const response = await fetch(`${this.clientApiUrl}/games/openGame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature
        },
        body: bodyString
      });

      const data = await response.json();
      if (!response.ok || data.status === 'fail') {
        throw new Error(data.message || data.error || 'Failed to open game');
      }

      return data.content.game.url;
    } catch (error) {
      this.logger.error(`Gregmorn openGame error: ${error.message}`);
      throw new InternalServerErrorException('Failed to launch game');
    }
  }
}
