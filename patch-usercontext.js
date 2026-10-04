const fs = require('fs');
let code = fs.readFileSync('src/context/UserContext.tsx', 'utf8');

const replacement = `
type UserContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  notifications: any[];
  unreadNotifCount: number;
  markNotifRead: (id: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const API_URL = "https://8111c.com/api/v1";
      const res = await fetch(\`\${API_URL}/notifications\`, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (e) {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const intv = setInterval(fetchNotifs, 15000);
      return () => clearInterval(intv);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const markNotifRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(\`https://8111c.com/api/v1/notifications/\${id}/read\`, {
        method: "POST",
        headers: { Authorization: \`Bearer \${token}\` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {}
  };

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  const refreshUser = async () => {
`;

code = code.replace(
  /type UserContextType = \{[\s\S]*?const refreshUser = async \(\) => \{/,
  replacement
);

code = code.replace(
  /<UserContext\.Provider value=\{\{ user, loading, login, logout, refreshUser \}\}>/,
  `<UserContext.Provider value={{ user, loading, login, logout, refreshUser, notifications, unreadNotifCount, markNotifRead }}>`
);

fs.writeFileSync('src/context/UserContext.tsx', code);
console.log("Updated UserContext.tsx with global notifications state!");
