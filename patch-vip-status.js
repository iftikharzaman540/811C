const fs = require('fs');
let vipCtrl = fs.readFileSync('/var/www/gaming-app/backend/src/vip/vip.controller.ts', 'utf8');

const getStatusRegex = /async getStatus\([\s\S]*?return\s*\{[\s\S]*?\};\s*\}/m;
const newGetStatus = `async getStatus(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: { vip_level: true, vip_bonus_claims: true }
    });

    const levels = await this.prisma.vipLevel.findMany({ orderBy: { level: 'asc' } });
    const currentLevel = user.vip_level || levels[0];
    
    // Find next level
    const nextLevel = levels.find(l => l.level > (currentLevel?.level || 0));

    const wageringReq = Number(user.current_wagering_requirement || 0);
    const wageringComp = Number(user.current_wagering_completed || 0);

    return {
      currentLevel: currentLevel?.level || 0,
      totalWagered: Number(user.total_wagered || 0),
      totalDeposited: Number(user.total_deposited || 0),
      nextLevel: nextLevel ? nextLevel.level : null,
      requiredForNext: nextLevel ? Number(nextLevel.min_turnover || 0) : null,
      remaining: nextLevel ? Math.max(0, Number(nextLevel.min_turnover || 0) - Number(user.total_wagered || 0)) : 0,
      wageringRequirement: wageringReq,
      wageringCompleted: wageringComp,
      wageringRemaining: Math.max(0, wageringReq - wageringComp),
      bonusBalance: await this.prisma.wallet.findUnique({where: {user_id: user.id}}).then(w => Number(w?.bonus_balance || 0)),
      claims: user.vip_bonus_claims || [],
      levels: levels.map(l => ({
         level: l.level,
         min_turnover: Number(l.min_turnover || 0),
         bonus_amount: Number(l.bonus_amount || 0)
      }))
    };
  }`;

if (vipCtrl.match(getStatusRegex)) {
  vipCtrl = vipCtrl.replace(getStatusRegex, newGetStatus);
  fs.writeFileSync('/var/www/gaming-app/backend/src/vip/vip.controller.ts', vipCtrl);
  console.log('Patched vip.controller.ts getStatus');
} else {
  console.log('Regex did not match getStatus');
}
