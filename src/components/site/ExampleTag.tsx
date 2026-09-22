import { cn } from "@/lib/utils";

/** Marks content that is illustrative, not a client result. See DESIGN_PHILOSOPHY.md §4.6 */
export function ExampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border-strong px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      Example
    </span>
  );
}
