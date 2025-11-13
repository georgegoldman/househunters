// PropertyCardSkeleton.tsx
import { SkeletonBlock } from "./SkeletonBlock";

export function PropertyCardSkeleton() {
  return (
    <article className="pb-[clamp(0.75rem,2vw,1rem)] flex flex-col gap-[clamp(1rem,3vw,1.25rem)] max-w-[clamp(20rem,40vw,25rem)] mx-auto">
      {/* Image area */}
      <div className="w-full h-[clamp(12rem,25vw,18.5rem)] relative">
        <SkeletonBlock className="w-full h-full rounded-[clamp(0.75rem,2vw,1.25rem)]" />

        {/* Status badge */}
        <SkeletonBlock className="
          absolute top-[clamp(0.5rem,1.5vw,0.625rem)] left-[clamp(0.5rem,1.5vw,0.625rem)]
          w-20 h-7 rounded-[clamp(0.75rem,2vw,1.25rem)]
        " />

        {/* Popular badge */}
        <SkeletonBlock className="
          absolute bottom-[-5%] left-[-2%]
          w-24 h-7 rounded-[clamp(0.25rem,1vw,0.5rem)]
        " />
      </div>

      {/* Content block */}
      <div className="flex flex-col gap-[clamp(1rem,3vw,1.25rem)] py-[clamp(0.5rem,1.5vw,0.625rem)] px-[clamp(1rem,3vw,1.25rem)]">
        {/* Price, title, location */}
        <div className="space-y-[clamp(0.75rem,2vw,1.25rem)]">
          <SkeletonBlock className="w-24 h-5" />
          <SkeletonBlock className="w-3/4 h-5" />
          <SkeletonBlock className="w-2/3 h-4" />
        </div>

        {/* Agent info */}
        <div className="flex items-center justify-between border-b border-black/10 pb-[clamp(0.375rem,1vw,0.5rem)]">
          <div className="flex items-center gap-[clamp(0.25rem,1vw,0.3125rem)]">
            <SkeletonBlock className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)] rounded-full" />
            <SkeletonBlock className="w-24 h-4" />
          </div>

          <div className="flex items-center gap-[clamp(0.25rem,1vw,0.3125rem)]">
            <SkeletonBlock className="w-4 h-4 rounded-full" />
            <SkeletonBlock className="w-20 h-4" />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-[clamp(0.75rem,3vw,1.25rem)]">
          <SkeletonBlock className="w-16 h-4 rounded-full" />
          <SkeletonBlock className="w-20 h-4 rounded-full" />
          <SkeletonBlock className="w-14 h-4 rounded-full" />
        </div>
      </div>
    </article>
  );
}
