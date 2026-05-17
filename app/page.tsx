import Link from "next/link";
import {
  TrendingUp,
  PieChart,
  Shield,
  Download,
  ArrowRight,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: DollarSign,
    title: "CRUD de Transações",
    description: "Registre receitas e despesas com descrição, valor, data e categoria de forma rápida e simples.",
  },
  {
    icon: TrendingUp,
    title: "Dashboard Inteligente",
    description: "Visualize em tempo real o total de receitas, despesas e saldo do mês em cards claros.",
  },
  {
    icon: PieChart,
    title: "Gráficos por Categoria",
    description: "Entenda para onde vai seu dinheiro com gráficos de pizza interativos por categoria.",
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Autenticação segura com Supabase Auth e Row Level Security. Seus dados são só seus.",
  },
  {
    icon: Download,
    title: "Exportar CSV",
    description: "Exporte suas transações filtradas para planilha com um clique, pronto para análise.",
  },
];

const benefits = [
  "Categorias pré-definidas (Alimentação, Transporte, Saúde e mais)",
  "Filtros por mês, ano, categoria e busca por descrição",
  "Interface responsiva — funciona no celular e desktop",
  "Deploy na Vercel em minutos",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">FinançasPessoais</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Controle financeiro simples e visual
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Organize suas finanças{" "}
            <span className="text-primary">de uma vez por todas</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Registre receitas e despesas, visualize dashboards com gráficos e
            exporte relatórios. Tudo em um app simples, seguro e bonito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Criar conta grátis <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
            <div className="bg-primary/5 border-b p-4 flex gap-2 items-center">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground ml-2">Dashboard — FinançasPessoais</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Receitas", value: "R$ 5.800,00", color: "text-green-600" },
                  { label: "Despesas", value: "R$ 3.420,50", color: "text-red-600" },
                  { label: "Saldo", value: "R$ 2.379,50", color: "text-blue-600" },
                ].map((card) => (
                  <div key={card.label} className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <div className="flex-1 rounded-lg border p-4 h-32 flex items-center justify-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-20 rounded-full border-[10px] border-primary/20 relative">
                      <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-primary border-r-green-500" />
                    </div>
                    <div className="space-y-2">
                      {[
                        { color: "bg-primary", label: "Alimentação 32%" },
                        { color: "bg-green-500", label: "Moradia 28%" },
                        { color: "bg-yellow-500", label: "Outros 40%" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 rounded-lg border p-4 space-y-2">
                  {["Salário — R$ 5.000", "Supermercado — R$ 380", "Conta de luz — R$ 120"].map((item) => (
                    <div key={item} className="text-xs py-1.5 border-b last:border-0 text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Tudo que você precisa</h2>
          <p className="text-center text-muted-foreground mb-12">
            Recursos pensados para quem quer organizar as finanças sem complicação.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-card p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-12">Simples do início ao fim</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 p-4 rounded-lg border">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-2xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para organizar suas finanças?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Crie sua conta gratuitamente e comece a registrar suas transações agora mesmo.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register">
              Começar grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-white" />
            </div>
            <span>FinançasPessoais</span>
          </div>
          <span>Feito com Next.js, Supabase e shadcn/ui</span>
        </div>
      </footer>
    </div>
  );
}
