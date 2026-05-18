"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  Download,
  Pencil,
  Trash2,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionForm } from "./transaction-form";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, downloadCSV } from "@/lib/utils";
import { CATEGORIES, type Transaction, type TransactionType } from "@/lib/types";

const MONTHS = [
  { value: "0", label: "Todos os meses" },
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

interface TransactionsClientProps {
  transactions: Transaction[];
}

export function TransactionsClient({ transactions: initialTransactions }: TransactionsClientProps) {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("0");
  const [year, setYear] = useState("0");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date + "T00:00:00");
      if (month !== "0" && tDate.getMonth() + 1 !== parseInt(month)) return false;
      if (year !== "0" && tDate.getFullYear() !== parseInt(year)) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, search, month, year, categoryFilter, typeFilter]);

  const totals = useMemo(() => {
    const receitas = filtered.filter((t) => t.type === "receita").reduce((s, t) => s + t.amount, 0);
    const despesas = filtered.filter((t) => t.type === "despesa").reduce((s, t) => s + t.amount, 0);
    return { receitas, despesas, saldo: receitas - despesas };
  }, [filtered]);

  const refreshData = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });
    setTransactions((data as Transaction[]) ?? []);
    router.refresh();
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta transação?")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      showToast("Erro ao excluir transação.", "error");
    } else {
      showToast("Transação excluída.", "success");
      await refreshData();
    }
    setDeletingId(null);
  }

  function handleExportCSV() {
    if (filtered.length === 0) {
      showToast("Nenhuma transação para exportar.", "info");
      return;
    }
    const header = "Descrição,Valor,Data,Tipo,Categoria";
    const rows = filtered.map((t) =>
      [
        `"${t.description}"`,
        t.amount.toFixed(2),
        t.date,
        t.type,
        t.category,
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    downloadCSV(csv, `transacoes-${Date.now()}.csv`);
    showToast("CSV exportado com sucesso!", "success");
  }

  function openNew() {
    setEditingTransaction(undefined);
    setFormKey((k) => k + 1);
    setDialogOpen(true);
  }

  function openEdit(t: Transaction) {
    setEditingTransaction(t);
    setFormKey((k) => k + 1);
    setDialogOpen(true);
  }

  async function handleFormSuccess() {
    setDialogOpen(false);
    showToast(
      editingTransaction ? "Transação atualizada!" : "Transação adicionada!",
      "success"
    );
    await refreshData();
  }

  return (
    <div className="space-y-6">
      {ToastComponent}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground text-sm">
            {filtered.length} transaç{filtered.length === 1 ? "ão" : "ões"} encontrada{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            Exportar CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openNew}>
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Nova transação
              </Button>
            </DialogTrigger>
            <TransactionForm
              key={formKey}
              transaction={editingTransaction}
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Summary mini cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-green-50 border-green-100 p-3 text-center">
          <p className="text-xs text-green-700 mb-1">Receitas</p>
          <p className="text-sm font-bold text-green-700">{formatCurrency(totals.receitas)}</p>
        </div>
        <div className="rounded-lg border bg-red-50 border-red-100 p-3 text-center">
          <p className="text-xs text-red-700 mb-1">Despesas</p>
          <p className="text-sm font-bold text-red-700">{formatCurrency(totals.despesas)}</p>
        </div>
        <div className={`rounded-lg border p-3 text-center ${totals.saldo >= 0 ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"}`}>
          <p className={`text-xs mb-1 ${totals.saldo >= 0 ? "text-blue-700" : "text-red-700"}`}>Saldo</p>
          <p className={`text-sm font-bold ${totals.saldo >= 0 ? "text-blue-700" : "text-red-700"}`}>
            {formatCurrency(totals.saldo)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Month */}
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year */}
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos os anos</SelectItem>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-sm">Nenhuma transação encontrada.</p>
              <Button variant="link" size="sm" onClick={openNew} className="mt-2">
                Adicionar primeira transação
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Descrição</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Categoria</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{t.description}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {formatDate(t.date)} · {t.category}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {t.category}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant={t.type === "receita" ? "success" : "danger"}>
                          {t.type}
                        </Badge>
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${t.type === "receita" ? "text-green-600" : "text-red-600"}`}>
                        {t.type === "receita" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Dialog open={dialogOpen && editingTransaction?.id === t.id} onOpenChange={(open) => { if (!open) setDialogOpen(false); }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => openEdit(t)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            </DialogTrigger>
                            {editingTransaction?.id === t.id && (
                              <TransactionForm
                                key={formKey}
                                transaction={editingTransaction}
                                onSuccess={handleFormSuccess}
                                onCancel={() => setDialogOpen(false)}
                              />
                            )}
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(t.id)}
                            disabled={deletingId === t.id}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
