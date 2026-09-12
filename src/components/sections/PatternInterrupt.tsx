import { Reveal } from "@/components/site/Reveal";

export function PatternInterrupt() {
  return (
    <section className="relative py-24 lg:py-36">
      <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
        <Reveal>
          <p className="text-3xl font-bold leading-[1.15] sm:text-5xl lg:text-[3.6rem]">
            The problem isn't
            <br />
            how much you work.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-8 text-3xl font-bold leading-[1.15] text-muted-foreground sm:text-5xl lg:text-[3.6rem]">
            It's how often
            <br />
            you do the same work <span className="text-gradient">twice.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
