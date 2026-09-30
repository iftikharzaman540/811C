const fs = require('fs');
let appModule = fs.readFileSync('backend/src/app.module.ts', 'utf8');

appModule = appModule.replace("import { GregmornModule } from './gregmorn/gregmorn.module';", "import { GregmornModule } from './gregmorn/gregmorn.module';\nimport { PromoModule } from './promo/promo.module';");

appModule = appModule.replace("GregmornModule\n  ],", "GregmornModule,\n    PromoModule\n  ],");

fs.writeFileSync('backend/src/app.module.ts', appModule);
console.log("PromoModule injected into AppModule");
