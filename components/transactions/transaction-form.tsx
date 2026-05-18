"use client";

import { useState } from "react";

function friendlyError(msg: string): string {
  if (msg.includes("relation") && msg.includes("does not exist"))
    return "Tabela não encontrada. Execute o SQL do arquivo supabase-schema.sql no painel do Supabase.";
  if (msg.includes("JWT") || msg.includes("not authenticated"))
    return "Sessão expirada. Faça login novamente.";
  if (msg.includes("violates row-level security"))
    return "Permissão negada. Verifique as políticas RLS no Supabase.";
  if (msg.includes("violates check constraint"))
    return "Valor inválido para um dos campos.";
  return `Erro: ${msg}`;
}
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CATEGORIES, type Transaction, type TransactionType } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const isEdit = !!transaction;

  const [description, setDescription] = useState(transaction?.description ?? "");
  const [amount, setAmount] = useState(transaction?.amount.toString() ?? "");
  const [date, setDate] = useState(
    transaction?.date ?? new Date().toISOString().split("T")[0]
  );
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "despesa");
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Selecione uma categoria.");
      return;
    }

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Informe um valor válido e maior que zero.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const payload = { description, amount: parsedAmount, date, type, category };

    if (isEdit) {
      const { error: dbError } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", transaction.id);
      if (dbError) {
        setError(friendlyError(dbError.message));
        setLoading(false);
        return;
      }
    } else {
      const { error: dbError } = await supabase.from("transactions").insert(payload);
      if (dbError) {
        setError(friendlyError(dbError.message));
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onSuccess();
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar Transação" : "Nova Transação"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Tipo */}
        <div className="grid grid-cols-2 gap-2">
          {(["receita", "despesa"] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                type === t
                  ? t === "receita"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-red-50 border-red-300 text-red-700"
                  : "bg-background border-input text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t === "receita" ? "Receita" : "Despesa"}
            </button>
          ))}
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            placeholder="Ex: Supermercado, Salário..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {/* Valor */}
        <div className="space-y-1.5">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Data */}
        <div className="space-y-1.5">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Categoria */}
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : isEdit ? (
              "Salvar alterações"
            ) : (
              "Adicionar"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
