import { useState } from "react";
import BottomNav from "./components/BottomNav";

// Pages
import Feed from "./pages/Feed";
import MatchPage from "./pages/MatchPage";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";

export default function App() {
  const [activeTab, setActiveTab] = useState("feed");

  let content;
  if (activeTab === "feed") content = <Feed />;
  else if (activeTab === "match") content = <MatchPage />;
  else if (activeTab === "groups") content = <Groups />;
  else content = <Profile />;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-md mx-auto relative">
        
        {/* HEADER */}
        <header className="pt-6 px-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Gym Social
            </div>
            <div className="text-2xl font-semibold tracking-tight">
              GymLink<span className="text-emerald-400">.</span>
            </div>
          </div>

          <div className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            Beta
          </div>
        </header>

        {/* ACTIVE PAGE CONTENT */}
        {content}

        {/* BOTTOM NAV */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
