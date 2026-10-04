const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

code = code.replace(
  `  const handleLaunchGame = async (gameId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to play");
      return;
    }`,
  `  const handleLaunchGame = async (gameId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to play");
      if (onLoginClick) onLoginClick();
      return;
    }`
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
