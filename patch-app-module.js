const fs = require('fs');
let code = fs.readFileSync('backend/src/app.module.ts', 'utf8');

if (!code.includes('SupportModule')) {
    code = code.replace(/import \{ WalletModule \} from '.\/wallet\/wallet.module';/, "import { WalletModule } from './wallet/wallet.module';\nimport { SupportModule } from './support/support.module';");
    code = code.replace(/WalletModule,/, "WalletModule,\n    SupportModule,");
    fs.writeFileSync('backend/src/app.module.ts', code);
    console.log("Registered SupportModule");
}
