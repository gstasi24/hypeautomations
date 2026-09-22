import { Statement } from "@/components/site/Section";

export function PatternInterrupt() {
  return (
    <Statement
      rail="manual"
      title={
        <>
          <span className="block text-manual">The problem isn't how much you work.</span>
          <span className="mt-2 block">It's how often you do the same work twice.</span>
        </>
      }
    />
  );
}
