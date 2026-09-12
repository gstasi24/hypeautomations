import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingFlow } from "./BookingFlow";

export function BookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[92vh] w-[min(100vw-1.5rem,52rem)] overflow-y-auto border-border bg-surface p-0 sm:max-w-3xl"
      >
        <DialogTitle className="sr-only">Book a free consultation</DialogTitle>
        <DialogDescription className="sr-only">
          Answer a few short questions and pick a time for your automation consultation.
        </DialogDescription>
        <BookingFlow onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
