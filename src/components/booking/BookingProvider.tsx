import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { BookingDialog } from "./BookingDialog";

type BookingContextValue = {
  open: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, openBooking, closeBooking }), [open, openBooking, closeBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog open={open} onOpenChange={setOpen} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    return { open: false, openBooking: () => {}, closeBooking: () => {} } satisfies BookingContextValue;
  }
  return context;
}
