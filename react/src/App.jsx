import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";

// Pages
import Feed from "./pages/Feed";
import Workout from "./pages/Workout";
import MatchPage from "./pages/MatchPage";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import Streaks from "./pages/Streaks";

export default function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "feed");
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.sessionStorage.getItem("lockedin:splash-dismissed") !== "true";
  });
  const [splashReady, setSplashReady] = useState(false);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashReady(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const content = useMemo(() => {
    if (activeTab === "feed") return <Feed />;
    if (activeTab === "streaks") return <Streaks />;
    if (activeTab === "track") return <Workout />;
    if (activeTab === "match") return <MatchPage />;
    if (activeTab === "groups") return <Groups />;
    return <Profile />;
  }, [activeTab]);

  if (showSplash) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-3xl font-semibold tracking-tight animate-pulse">
            LockedIN<span className="text-emerald-400">.</span>
          </div>
          <div className="text-xs uppercase tracking-[0.4em] text-gray-600">
            behavior loading
          </div>
          <button
            onClick={() => {
              if (!splashReady) return;
              setShowSplash(false);
              if (typeof window !== "undefined") {
                window.sessionStorage.setItem("lockedin:splash-dismissed", "true");
              }
            }}
            disabled={!splashReady}
            className={`px-6 py-2 rounded-full border text-sm tracking-wide transition ${
              splashReady
                ? "border-white text-white hover:bg-white hover:text-black"
                : "border-white/10 text-gray-500 cursor-wait"
            }`}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-md mx-auto relative">
        <header className="pt-6 px-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Gym Social
            </div>
            <div className="text-2xl font-semibold tracking-tight">
              LockedIN<span className="text-emerald-400">.</span>
            </div>
          </div>

          <div className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            Beta
          </div>
        </header>

        {content}

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
