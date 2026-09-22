import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import { cn } from "@/lib/utils";

/** Mobile-only bar. Appears after the hero, hides while the booking dialog is open. */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const { openBooking, open } = useBooking();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-(--motion-state) lg:hidden",
        visible && !open ? "translate-y-0" : "translate-y-full",
      )}
    >
      <Button size="lg" className="w-full" onClick={openBooking}>
        Book a free consultation
      </Button>
    </div>
  );
}
