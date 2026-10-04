const fs = require('fs');

// 1. Update AdminMarketingService
let adminSvc = fs.readFileSync('backend/src/admin/admin-marketing/admin-marketing.service.ts', 'utf8');
const eventMethods = `
  async getEvents() {
    let setting = await this.prisma.systemSetting.findUnique({ where: { key: 'promo_events' } });
    if (!setting) {
      const defaultEvents = [
        { id: 1, title: 'Invitation Event', desc: 'Each player you invite', highlight: 'Get Rs 600', icon: '??', category: 'Cooperation' }
      ];
      setting = await this.prisma.systemSetting.create({
        data: { key: 'promo_events', value: JSON.stringify(defaultEvents), description: 'Promo Events' }
      });
    }
    return JSON.parse(setting.value as string);
  }

  async updateEvents(data: any) {
    const setting = await this.prisma.systemSetting.upsert({
      where: { key: 'promo_events' },
      update: { value: JSON.stringify(data) },
      create: { key: 'promo_events', value: JSON.stringify(data), description: 'Promo Events' }
    });
    return JSON.parse(setting.value as string);
  }
`;
adminSvc = adminSvc.replace(/export class AdminMarketingService \{/, match => match + eventMethods);
fs.writeFileSync('backend/src/admin/admin-marketing/admin-marketing.service.ts', adminSvc);

// 2. Update AdminMarketingController
let adminCtrl = fs.readFileSync('backend/src/admin/admin-marketing/admin-marketing.controller.ts', 'utf8');
const eventRoutes = `
  @Get('events')
  getEvents() {
    return this.svc.getEvents();
  }

  @Post('events')
  updateEvents(@Body() data: any) {
    return this.svc.updateEvents(data);
  }
`;
adminCtrl = adminCtrl.replace(/export class AdminMarketingController \{[\s\S]*?constructor[^\}]+\}/, match => match + eventRoutes);
fs.writeFileSync('backend/src/admin/admin-marketing/admin-marketing.controller.ts', adminCtrl);

// 3. Update PromoService
let promoSvc = fs.readFileSync('backend/src/promo/promo.service.ts', 'utf8');
const publicEventMethod = `
  async getEvents() {
    const setting = await this.prisma.systemSetting.findUnique({ where: { key: 'promo_events' } });
    if (!setting) return [];
    return JSON.parse(setting.value as string);
  }
`;
promoSvc = promoSvc.replace(/export class PromoService \{/, match => match + publicEventMethod);
fs.writeFileSync('backend/src/promo/promo.service.ts', promoSvc);

// 4. Update PromoController
let promoCtrl = fs.readFileSync('backend/src/promo/promo.controller.ts', 'utf8');
const publicEventRoute = `
  @Get('events')
  @ApiOperation({ summary: 'Get all promo events' })
  async getEvents() {
    return this.promoService.getEvents();
  }
`;
promoCtrl = promoCtrl.replace(/export class PromoController \{[\s\S]*?constructor[^\}]+\}/, match => match + publicEventRoute);
if (!promoCtrl.includes('Get,')) promoCtrl = promoCtrl.replace('Controller, Post', 'Controller, Get, Post');
fs.writeFileSync('backend/src/promo/promo.controller.ts', promoCtrl);

console.log("Backend APIs added!");
