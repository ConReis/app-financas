"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, PlusCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const CHART_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899",
];

interface DashboardClientProps {
  transactions: Transaction[];
  currentMonth: number;
  currentYear: number;
}

export function DashboardClient({ transactions, currentMonth, currentYear }: DashboardClientProps) {
  const { totalReceitas, totalDespesas, saldo, categoryData, recentTransactions } = useMemo(() => {
    const receitas = transactions.filter((t) => t.type === "receita");
    const despesas = transactions.filter((t) => t.type === "despesa");

    const totalReceitas = receitas.reduce((sum, t) => sum + t.amount, 0);
    const totalDespesas = despesas.reduce((sum, t) => sum + t.amount, 0);
    const saldo = totalReceitas - totalDespesas;

    const categoryMap: Record<string, number> = {};
    despesas.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const recentTransactions = [...transactions].slice(0, 5);

    return { totalReceitas, totalDespesas, saldo, categoryData, recentTransactions };
  }, [transactions]);

  const summaryCards = [
    {
      title: "Receitas",
      value: totalReceitas,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      title: "Despesas",
      value: totalDespesas,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      title: "Saldo",
      value: saldo,
      icon: Wallet,
      color: saldo >= 0 ? "text-blue-600" : "text-red-600",
      bg: saldo >= 0 ? "bg-blue-50" : "bg-red-50",
      border: saldo >= 0 ? "border-blue-100" : "border-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {MONTHS[currentMonth - 1]} de {currentYear}
          </p>
        </div>
        <Button asChild>
          <Link href="/transactions">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova transação
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className={`border ${card.border}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Nenhuma despesa registrada neste mês.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), "Valor"]}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Últimas Transações</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/transactions">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground text-sm gap-3">
                <p>Nenhuma transação registrada neste mês.</p>
                <Button size="sm" asChild>
                  <Link href="/transactions">Adicionar transação</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          t.type === "receita" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(t.date)} · {t.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p
                        className={`text-sm font-semibold ${
                          t.type === "receita" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {t.type === "receita" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </p>
                      <Badge
                        variant={t.type === "receita" ? "success" : "danger"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {t.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
