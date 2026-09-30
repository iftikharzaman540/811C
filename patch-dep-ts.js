const fs = require('fs');
let depCode = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');
depCode = depCode.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
fs.writeFileSync('src/components/DepositScreen.tsx', depCode);
