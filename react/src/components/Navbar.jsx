export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-around py-4 text-white z-50">

      {/* Home */}
      <button className="opacity-90">
        <img 
          src="https://img.icons8.com/3d-fluency/512/home.png" 
          className="w-8 h-8" 
        />
      </button>

      {/* Camera */}
      <button className="w-16 h-16 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,0.8)] flex items-center justify-center -mt-8">
        <img 
          src="https://img.icons8.com/3d-fluency/512/camera.png" 
          className="w-9 h-9" 
        />
      </button>

      {/* Search */}
      <button className="opacity-90">
        <img 
          src="https://img.icons8.com/3d-fluency/512/search.png" 
          className="w-8 h-8" 
        />
      </button>
    </div>
  );
}
