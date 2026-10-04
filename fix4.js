const fs = require('fs');
let c = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

if (!c.includes('useEffect')) {
  c = c.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");
  c = c.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
}

if (!c.includes('apiRequest')) {
  c = c.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { apiRequest } from '@/utils/api';");
}

c = c.replace(/res =>/, "(res: any) =>");

fs.writeFileSync('src/app/promo/page.tsx', c);
