import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import { cn } from "@/lib/utils";

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
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 px-4 py-3 backdrop-blur-xl transition-transform duration-500 lg:hidden",
        visible && !open ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Ready to automate?</p>
        <Button size="sm" className="h-10 px-5" onClick={openBooking}>
          Book a Call
        </Button>
      </div>
    </div>
  );
}
