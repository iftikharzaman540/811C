const fs = require('fs');
let code = fs.readFileSync('backend/src/admin-financials/admin-financials.controller.ts', 'utf8');

code = code.replace(/import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs\/common';/, "import { Controller, Get, Patch, Param, Query, UseGuards, Body } from '@nestjs/common';");

fs.writeFileSync('backend/src/admin-financials/admin-financials.controller.ts', code);
