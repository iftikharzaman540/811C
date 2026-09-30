const fs = require('fs');
let depCode = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

if (!depCode.includes('useEffect')) {
    depCode = depCode.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
}
depCode = depCode.replace('[user, loading, router]', '[user, userLoading, router]');
fs.writeFileSync('src/components/DepositScreen.tsx', depCode);

let wdCode = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');
wdCode = wdCode.replace('[user, loading, router]', '[user, userLoading, router]');
fs.writeFileSync('src/components/WithdrawScreen.tsx', wdCode);
