import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section kinds and the rail, per DESIGN_PHILOSOPHY.md §7.
 * A Statement is type on the page background. An Instrument is one panel that does something.
 * The rail is the run, continued down the page: dashed grey through manual work,
 * solid gradient where automation is flowing, green at the end.
 */
export type RailState = "manual" | "flow" | "done";

export function Rail({ state, className }: { state: RailState; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative flex justify-center", className)}>
      <span
        className={cn(
          "absolute top-2 size-2.5 rounded-full",
          state === "manual" && "border border-manual bg-background",
          state === "flow" && "bg-brand-gradient",
          state === "done" && "bg-success",
        )}
      />
      <span
        className={cn(
          "mt-2 block h-full",
          state === "manual" && "w-0 border-l border-dashed border-manual/60",
          state === "flow" && "w-px bg-brand-gradient",
          state === "done" && "w-px bg-success",
        )}
      />
    </div>
  );
}

type SectionProps = {
  id?: string | undefined;
  rail: RailState;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  /** Rendered after the panel, outside it. Instrument only. */
  after?: ReactNode;
  className?: string | undefined;
};

function Shell({
  id,
  rail,
  className,
  children,
}: Pick<SectionProps, "id" | "rail" | "className" | "children">) {
  return (
    <section id={id} className={cn("relative py-12 lg:py-16", className)}>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1rem_1fr] gap-x-4 px-5 lg:grid-cols-[3rem_1fr] lg:gap-x-6 lg:px-8">
        <Rail state={rail} />
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function Heading({ title, lead }: Pick<SectionProps, "title" | "lead">) {
  return (
    <>
      <h2 className="type-statement max-w-3xl">{title}</h2>
      {lead ? <p className="mt-5 max-w-xl text-lg text-muted-foreground">{lead}</p> : null}
    </>
  );
}

export function Statement({ id, rail, title, lead, children, className }: SectionProps) {
  return (
    <Shell id={id} rail={rail} className={className}>
      <Heading title={title} lead={lead} />
      {children ? <div className="mt-10 lg:mt-12">{children}</div> : null}
    </Shell>
  );
}

export function Instrument({ id, rail, title, lead, children, after, className }: SectionProps) {
  return (
    <Shell id={id} rail={rail} className={className}>
      <Heading title={title} lead={lead} />
      <div className="mt-10 rounded-panel border border-border bg-surface p-5 sm:p-8 lg:mt-12">
        {children}
      </div>
      {after}
    </Shell>
  );
}
