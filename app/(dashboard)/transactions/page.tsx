import { createClient } from "@/lib/supabase/server";
import { TransactionsClient } from "@/components/transactions/transactions-client";
import type { Transaction } from "@/lib/types";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  return <TransactionsClient transactions={(transactions as Transaction[]) ?? []} />;
}
