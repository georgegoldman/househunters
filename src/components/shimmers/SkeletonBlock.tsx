// SkeletonBlock.tsx (or inside same file)
export const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200/80 animate-pulse rounded-md ${className}`} />
);
