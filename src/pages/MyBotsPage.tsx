import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Page } from "@/App";
import { getBots } from "@/lib/api";

interface Props {
  onNavigate: (page: Page) => void;
}

interface Bot {
  id: number;
  bot_name: string;
  telegram_username: string;
  telegram_link: string | null;
  description: string;
  status: string;
  scenario_steps: number;
  created_at: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч назад`;
  return `${Math.floor(hrs / 24)} д назад`;
}

export default function MyBotsPage({ onNavigate }: Props) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBots()
      .then(setBots)
      .catch(() => setError("Не удалось загрузить ботов"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-oswald text-4xl font-bold">
            МОИ <span className="gradient-text">БОТЫ</span>
          </h1>
          <p className="text-muted-foreground mt-1">Все боты, которые ты создал на этом устройстве</p>
        </div>
        <button
          onClick={() => onNavigate("constructor")}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white btn-glow flex items-center gap-2 self-start"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          <Icon name="Plus" size={18} />
          Новый бот
        </button>
      </div>

      {/* Summary */}
      {!loading && bots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Всего ботов", value: String(bots.length), icon: "Bot", color: "#8b5cf6" },
            { label: "Активных", value: String(bots.filter(b => b.status === "active").length), icon: "Activity", color: "#10b981" },
            { label: "В Telegram", value: String(bots.filter(b => !!b.telegram_link).length), icon: "Send", color: "#0088cc" },
            { label: "Сценариев", value: String(bots.reduce((s, b) => s + (b.scenario_steps || 0), 0)), icon: "MessageSquare", color: "#ec4899" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${card.color}22` }}>
                <Icon name={card.icon} size={18} style={{ color: card.color }} />
              </div>
              <div className="font-oswald text-2xl font-bold text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Загружаем твоих ботов...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl px-5 py-4 text-sm mb-6"
          style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", color: "#f9a8d4" }}>
          ⚠ {error}
        </div>
      )}

      {/* Bot list */}
      {!loading && bots.length > 0 && (
        <div className="grid gap-4">
          {bots.map((bot) => (
            <div key={bot.id} className="card-glow rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Icon + info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <Icon name="Bot" size={26} style={{ color: "#8b5cf6" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground truncate">{bot.bot_name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                        style={{
                          background: bot.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                          color: bot.status === "active" ? "#10b981" : "#f59e0b",
                        }}>
                        {bot.status === "active" ? "● Активен" : "На паузе"}
                      </span>
                    </div>
                    {bot.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{bot.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {bot.telegram_username && <span>@{bot.telegram_username}</span>}
                      <span>{timeAgo(bot.created_at)}</span>
                      <span>{bot.scenario_steps} реплик</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {bot.telegram_link && (
                    <a
                      href={bot.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                      style={{ background: "rgba(0,136,204,0.2)", border: "1px solid rgba(0,136,204,0.4)", color: "#0088cc" }}
                    >
                      <Icon name="Send" size={14} />
                      Открыть
                    </a>
                  )}
                  <button
                    className="p-2 rounded-xl transition-all hover:bg-white/10"
                    style={{ color: "#94a3b8" }}
                    title="Настройки"
                  >
                    <Icon name="Settings" size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && bots.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <Icon name="Bot" size={36} style={{ color: "#8b5cf6" }} />
          </div>
          <h3 className="font-oswald text-2xl font-bold text-foreground mb-2">Ещё нет ботов</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">Создай первого бота за 2 минуты — без кода и регистраций</p>
          <button
            onClick={() => onNavigate("constructor")}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white btn-glow"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            Создать первого бота →
          </button>
        </div>
      )}
    </div>
  );
}
