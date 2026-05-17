import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Page } from "@/App";

interface Props {
  onNavigate: (page: Page) => void;
}

const bots = [
  {
    id: 1,
    name: "Бот поддержки клиентов",
    type: "Поддержка",
    status: "active",
    messages: 1248,
    conversion: 34,
    color: "#22d3ee",
    icon: "HeadphonesIcon",
    channels: ["Telegram", "WhatsApp"],
  },
  {
    id: 2,
    name: "FAQ для интернет-магазина",
    type: "FAQ",
    status: "active",
    messages: 874,
    conversion: 61,
    color: "#8b5cf6",
    icon: "HelpCircle",
    channels: ["Telegram"],
  },
  {
    id: 3,
    name: "Продажи онлайн-курсов",
    type: "Продажи",
    status: "paused",
    messages: 312,
    conversion: 22,
    color: "#ec4899",
    icon: "ShoppingBag",
    channels: ["Telegram", "ВКонтакте"],
  },
];

const statusLabel = {
  active: { text: "Активен", color: "#10b981" },
  paused: { text: "Пауза", color: "#f59e0b" },
};

export default function MyBotsPage({ onNavigate }: Props) {
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");

  const filtered = bots.filter((b) => filter === "all" || b.status === filter);

  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-oswald text-4xl font-bold">
            МОИ <span className="gradient-text">БОТЫ</span>
          </h1>
          <p className="text-muted-foreground mt-1">Управляй и следи за всеми своими ботами</p>
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Всего ботов", value: "3", icon: "Bot", color: "#8b5cf6" },
          { label: "Активных", value: "2", icon: "Activity", color: "#10b981" },
          { label: "Сообщений сегодня", value: "148", icon: "MessageCircle", color: "#22d3ee" },
          { label: "Средняя конверсия", value: "39%", icon: "TrendingUp", color: "#ec4899" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${card.color}22` }}
            >
              <Icon name={card.icon} size={18} style={{ color: card.color }} />
            </div>
            <div className="font-oswald text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "paused"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === f ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
            style={
              filter === f
                ? { background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }
                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            {f === "all" ? "Все" : f === "active" ? "Активные" : "На паузе"}
          </button>
        ))}
      </div>

      {/* Bot cards */}
      <div className="grid gap-4">
        {filtered.map((bot) => (
          <div
            key={bot.id}
            className="card-glow rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Icon + name */}
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${bot.color}22`, border: `1px solid ${bot.color}44` }}
                >
                  <Icon name={bot.icon} size={26} style={{ color: bot.color }} fallback="Bot" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground">{bot.name}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${statusLabel[bot.status as keyof typeof statusLabel].color}22`,
                        color: statusLabel[bot.status as keyof typeof statusLabel].color,
                      }}
                    >
                      {statusLabel[bot.status as keyof typeof statusLabel].text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">{bot.type}</span>
                    <span className="text-muted-foreground">·</span>
                    {bot.channels.map((ch) => (
                      <span
                        key={ch}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8" }}
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="font-oswald text-xl font-bold text-foreground">{bot.messages.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">сообщений</div>
                </div>
                <div className="text-center">
                  <div className="font-oswald text-xl font-bold" style={{ color: "#10b981" }}>{bot.conversion}%</div>
                  <div className="text-xs text-muted-foreground">конверсия</div>
                </div>
                {/* Progress bar */}
                <div className="hidden sm:block w-24">
                  <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${bot.conversion}%`,
                        background: `linear-gradient(90deg, ${bot.color}, #8b5cf6)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-xl transition-all hover:bg-white/10"
                  style={{ color: "#94a3b8" }}
                  title="Статистика"
                >
                  <Icon name="BarChart2" size={18} />
                </button>
                <button
                  className="p-2 rounded-xl transition-all hover:bg-white/10"
                  style={{ color: "#94a3b8" }}
                  title="Редактировать"
                >
                  <Icon name="Pencil" size={18} />
                </button>
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

      {/* Empty CTA */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Нет ботов в этой категории</p>
          <button
            onClick={() => onNavigate("constructor")}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white btn-glow"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            Создать первого бота
          </button>
        </div>
      )}
    </div>
  );
}
