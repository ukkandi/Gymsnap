export default function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    {
      id: "feed",
      label: "Feed",
      icon: "https://api.iconify.design/mdi/fire.svg"
    },
    {
      id: "match",
      label: "Match",
      icon: "https://api.iconify.design/mdi/account-heart.svg"
    },
    {
      id: "groups",
      label: "Groups",
      icon: "https://api.iconify.design/mdi/account-group.svg"
    },
    {
      id: "profile",
      label: "Profile",
      icon: "https://api.iconify.design/mdi/account-circle.svg"
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center bg-black/70 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={
              "flex flex-col items-center mx-3 transition " +
              (activeTab === item.id
                ? "text-white"
                : "text-gray-400 hover:text-white/80")
            }
          >
            <img
              src={item.icon}
              alt={item.label}
              className={
                "w-6 h-6 mb-1 transition " +
                (activeTab === item.id ? "scale-110" : "scale-100 opacity-80")
              }
            />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
