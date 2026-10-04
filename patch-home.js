const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

if (!content.includes('useUser')) {
  content = content.replace(
    'import toast from "react-hot-toast";',
    'import toast from "react-hot-toast";\nimport { useUser } from "@/context/UserContext";'
  );

  content = content.replace(
    'const [isMenuOpen, setIsMenuOpen] = useState(false);',
    'const [isMenuOpen, setIsMenuOpen] = useState(false);\n  const { user, logout } = useUser();'
  );

  content = content.replace(
    '<div className="flex items-center gap-2 ml-auto shrink-0">\n          <button onClick={onLoginClick',
    `<div className="flex items-center gap-2 ml-auto shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-neutral-400 leading-none">Balance</span>
                <span className="text-[#ffdf00] font-bold text-[14px]">Rs {user.balance.toFixed(2)}</span>
              </div>
              <button onClick={() => { logout(); toast.success("Logged out"); }} className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white">
                <User className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button onClick={onLoginClick`
  );

  content = content.replace(
    '</button>\n            </div>\n          </div>',
    '</button>\n            </div>\n            </>\n          )}\n          </div>'
  );

  fs.writeFileSync('src/components/HomeScreen.tsx', content);
  console.log('Patched HomeScreen');
}
