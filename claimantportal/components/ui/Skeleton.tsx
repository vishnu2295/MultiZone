/** Shimmering placeholder bar/block used to build loading skeletons. */
export default function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`shimmer inline-block rounded ${className}`} />;
}
