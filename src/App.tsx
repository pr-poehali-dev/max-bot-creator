import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import MyBotsPage from "./pages/MyBotsPage";
import ConstructorPage from "./pages/ConstructorPage";

export type Page = "landing" | "mybots" | "constructor";

const App = () => {
  const [page, setPage] = useState<Page>("landing");

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-background mesh-bg">
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
          style={{
            background: "rgba(10,10,18,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <button
            onClick={() => setPage("landing")}
            className="font-oswald text-xl font-bold tracking-widest uppercase"
          >
            <span className="gradient-text">BOT</span>
            <span className="text-foreground">FLOW</span>
          </button>

          <div
            className="flex items-center gap-1 p-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            {(
              [
                { id: "landing", label: "Главная" },
                { id: "mybots", label: "Мои боты" },
                { id: "constructor", label: "Конструктор" },
              ] as { id: Page; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  page === item.id
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={
                  page === item.id
                    ? { background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }
                    : {}
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage("constructor")}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white btn-glow hidden md:block"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            Создать бота
          </button>
        </nav>

        <main>
          {page === "landing" && <LandingPage onNavigate={setPage} />}
          {page === "mybots" && <MyBotsPage onNavigate={setPage} />}
          {page === "constructor" && <ConstructorPage onNavigate={setPage} />}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default App;
