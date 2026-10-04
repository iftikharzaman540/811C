const fs = require("fs");
let authService = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", "utf8");

if (!authService.includes("async generateTokens(")) {
  const injectTokens = `
  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async updateProfile(userId: string, data: any) {`;
  authService = authService.replace(/  async updateProfile\(userId: string, data: any\) \{/, injectTokens);
  fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", authService);
  console.log("auth.service.ts repaired");
} else {
  console.log("generateTokens already exists");
}
