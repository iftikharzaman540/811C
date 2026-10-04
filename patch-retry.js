const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn.service.ts';
let code = fs.readFileSync(file, 'utf8');

const getGamesReplacement = `
  async getGames(currency: string = 'PKR', retry: boolean = true) {
    const token = await this.login();
    try {
      const response = await fetch(\`\${this.officeApiUrl}/users/\${this.userId}/getUserGames/\${currency}\`, {
        method: 'GET',
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401 && retry) {
          this.logger.warn('Token unauthorized/superseded, clearing token and retrying...');
          this.accessToken = null;
          this.tokenExpiry = 0;
          return this.getGames(currency, false);
        }
        throw new Error(data.message || data.error || 'Failed to fetch games');
      }
      return Array.isArray(data) ? data.filter((g: any) => g.isEnabled) : data;
    } catch (error) {
      this.logger.error(\`Gregmorn getGames error: \${error.message}\`);
      throw new InternalServerErrorException('Failed to fetch game list');
    }
  }
`;

code = code.replace(
  /async getGames\(currency: string = 'PKR'\) \{[\s\S]*?throw new InternalServerErrorException\('Failed to fetch game list'\);\s*\}/,
  getGamesReplacement.trim()
);

fs.writeFileSync(file, code);
console.log("Patched getGames to handle token superseding");
