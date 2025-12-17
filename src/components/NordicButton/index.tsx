export default function NordicButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center justify-center
        px-5 py-2.5 rounded-lg
        bg-white text-gray-900 font-medium
        border border-gray-300 shadow-sm
        hover:bg-gray-100 hover:border-gray-400
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
        transition-all duration-200 ease-in-out
      "
    >
      {children}
    </button>
  );
}