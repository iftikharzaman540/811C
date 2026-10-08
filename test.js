const gamesList = [
  { name: "Aviator", hot: true },
  { name: "Super Ace", hot: false }
];
const miniGamesList = [];
const realGames = [];

const sidebarSearch = "hot";

const filtered = [...gamesList, ...miniGamesList, ...realGames].filter((g) => 
  ((g.title || g.name) || "").toLowerCase().includes(sidebarSearch.toLowerCase())
);

console.log("Found:", filtered);
