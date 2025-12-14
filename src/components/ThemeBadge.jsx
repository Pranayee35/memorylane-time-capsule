export const ThemeBadge = ({ theme }) => {
  return (
    <span className="inline-block bg-purple-600/20 text-purple-400 text-xs px-3 py-1 rounded-full">
      {theme}
    </span>
  );
};
