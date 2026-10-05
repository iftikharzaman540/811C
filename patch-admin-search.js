const fs = require('fs');
let code = fs.readFileSync('backend/src/admin-financials/admin-financials.service.ts', 'utf8');

const target = `  async getDeposits(page = 1, limit = 20, status?: FinancialStatus) {
    const skip = (page - 1) * limit;
    const where: any = { type: 'DEPOSIT' };
    if (status) where.status = status;`;

const replacement = `  async getDeposits(page = 1, limit = 20, status?: FinancialStatus, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { type: 'DEPOSIT' };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { transaction_reference: { contains: search, mode: 'insensitive' } },
        { user: { username: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('backend/src/admin-financials/admin-financials.service.ts', code);

let ctrlCode = fs.readFileSync('backend/src/admin-financials/admin-financials.controller.ts', 'utf8');
const ctrlTarget = `  async getDeposits(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: FinancialStatus
  ) {
    return this.service.getDeposits(Number(page), Number(limit), status);
  }`;
const ctrlReplacement = `  async getDeposits(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: FinancialStatus,
    @Query('search') search?: string
  ) {
    return this.service.getDeposits(Number(page), Number(limit), status, search);
  }`;
ctrlCode = ctrlCode.replace(ctrlTarget, ctrlReplacement);
fs.writeFileSync('backend/src/admin-financials/admin-financials.controller.ts', ctrlCode);
