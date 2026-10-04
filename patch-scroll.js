const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const scrollLockEffect = `
  useEffect(() => {
    if (gameUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [gameUrl]);
`;

code = code.replace(
  "const router = useRouter();",
  "const router = useRouter();\n" + scrollLockEffect
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Added scroll lock to HomeScreen.tsx!");
