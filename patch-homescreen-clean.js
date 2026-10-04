const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Remove Bell import
code = code.replace(", MessageSquare, Bell } from", ", MessageSquare } from");

// 2. Remove notifications state and fetchNotifs effect
code = code.replace(/const \[notifications, setNotifications\] = useState<any\[\]>\(\[\]\);.*?const markNotifRead = async \(id: string\) => \{.*?catch \(e\) \{\}\s*\};\s*/s, "");

// 3. Keep showNotifModal (maybe rename it) or delete it since it's going to Profile. 
// Let's delete showNotifModal state completely from HomeScreen.
code = code.replace(/const \[showNotifModal, setShowNotifModal\] = useState\(false\);\s*/, "");

// 4. Update the scroll lock effect to remove showNotifModal
code = code.replace(/useEffect\(\(\) => \{\s*if \(gameUrl \|\| showNotifModal\) \{.*?window\.removeEventListener\('popstate', handlePopState\);\s*\};\s*\}, \[gameUrl, showNotifModal\]\);/s, 
`  useEffect(() => {
    if (gameUrl) {
      document.body.style.overflow = 'hidden';
      window.history.pushState({ gameOpen: true }, '');
    } else {
      document.body.style.overflow = '';
    }

    const handlePopState = (e: any) => {
      if (gameUrl) setGameUrl(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
    };
  }, [gameUrl]);`);

// 5. Remove the Bell icon and unread count logic
code = code.replace(/\{\/\* Bell Icon \*\/\}.*?<\/button>/s, "");

// 6. Remove the Notification Modal UI
code = code.replace(/\{\/\* Notification Modal \*\/\}.*?<\/AnimatePresence>/s, "");

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Cleaned up HomeScreen.tsx!");
