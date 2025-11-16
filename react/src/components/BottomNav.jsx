import {
  FireIcon,
  BoltIcon,
  HeartIcon,
  UserGroupIcon,
  UserCircleIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

export default function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    {
      id: "feed",
      label: "Feed",
      icon: FireIcon
    },
    {
      id: "streaks",
      label: "Streaks",
      icon: CalendarDaysIcon
    },
    {
      id: "track",
      label: "Track",
      icon: BoltIcon
    },
    {
      id: "match",
      label: "Match",
      icon: HeartIcon
    },
    {
      id: "groups",
      label: "Groups",
      icon: UserGroupIcon
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserCircleIcon
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center bg-black/70 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
        {items.map(item => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={
              "flex flex-col items-center mx-2 transition " +
                (activeTab === item.id
                  ? "text-white"
                  : "text-gray-400 hover:text-white/80")
              }
            >
              <Icon
                className={
                  "w-6 h-6 mb-1 transition " +
                  (activeTab === item.id
                    ? "scale-110 text-white"
                    : "scale-100 opacity-80 text-gray-300")
                }
                aria-hidden="true"
              />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
