export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="flex items-baseline gap-[0.1em] text-[1.05rem] font-extrabold leading-none tracking-[0.14em]">
        <span>H</span>
        <span className="text-gradient">Y</span>
        <span>PE</span>
      </span>
      <span className="mt-1 block text-[0.5rem] font-medium uppercase tracking-[0.42em] text-muted-foreground">
        Automations
      </span>
    </span>
  );
}
