import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyAccount } from "@/lib/private-ai/private-ai.functions";

export function useMyAccount() {
  const fetch = useServerFn(getMyAccount);
  return useQuery({ queryKey: ["pai-account"], queryFn: () => fetch() });
}

/** The purchased order if any, otherwise the most recent open one. */
export function primaryOrder<T extends { payment_status: string }>(orders: T[]) {
  return orders.find((o) => o.payment_status === "paid") ?? orders[0] ?? null;
}
