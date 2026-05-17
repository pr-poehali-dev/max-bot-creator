import Icon from "@/components/ui/icon";
import { Page } from "@/App";

interface Props {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: "12 000+", label: "Активных ботов" },
  { value: "3 мин", label: "До запуска" },
  { value: "98%", label: "Довольных клиентов" },
];

const features = [
  {
    icon: "Zap",
    title: "Мгновенный запуск",
    desc: "Выберите шаблон, настройте под себя и запустите за 3 минуты. Никакого кода.",
    color: "#8b5cf6",
  },
  {
    icon: "MessageSquare",
    title: "Умные диалоги",
    desc: "Бот понимает контекст и ведёт естественные беседы с вашими клиентами.",
    color: "#22d3ee",
  },
  {
    icon: "BarChart3",
    title: "Аналитика в реальном времени",
    desc: "Отслеживайте конверсии, довольство клиентов и эффективность бота.",
    color: "#ec4899",
  },
  {
    icon: "Globe",
    title: "Мультиканальность",
    desc: "Один бот — сразу в Telegram, WhatsApp, на сайте и в ВКонтакте.",
    color: "#10b981",
  },
];

export default function LandingPage({ onNavigate }: Props) {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-float"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
            bottom: "20%",
            right: "10%",
            filter: "blur(60px)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
            style={{
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#a78bfa",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Платформа нового поколения для чат-ботов
          </div>

          <h1
            className="font-oswald text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 animate-fade-in-up delay-100"
            style={{ letterSpacing: "-0.02em" }}
          >
            СОЗДАЙ БОТА
            <br />
            <span className="gradient-text">ЗА 3 МИНУТЫ</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            BotFlow — визуальный конструктор умных чат-ботов. Никакого кода. Просто выбери шаблон, настрой и запусти в любом мессенджере.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <button
              onClick={() => onNavigate("constructor")}
              className="px-8 py-4 rounded-2xl text-base font-semibold text-white btn-glow"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
            >
              Попробовать бесплатно →
            </button>
            <button
              onClick={() => onNavigate("mybots")}
              className="px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0" }}
            >
              Посмотреть примеры
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 animate-fade-in-up delay-500"
        >
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="font-oswald text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4">
            ВСЁ, ЧТО НУЖНО ДЛЯ{" "}
            <span className="gradient-text-pink">РОСТА</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Мощные инструменты в простом интерфейсе — от шаблонов до аналитики
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-glow rounded-2xl p-8 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${f.color}22`, border: `1px solid ${f.color}44` }}
              >
                <Icon name={f.icon} size={22} style={{ color: f.color }} />
              </div>
              <h3 className="font-oswald text-xl font-bold mb-3 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.1))",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)",
            }}
          />
          <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4 relative z-10">
            ГОТОВ ЗАПУСТИТЬ <span className="gradient-text">СВОЕГО БОТА?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 relative z-10">
            Первый бот бесплатно. Никакой кредитной карты.
          </p>
          <button
            onClick={() => onNavigate("constructor")}
            className="px-10 py-4 rounded-2xl text-base font-semibold text-white btn-glow relative z-10"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            Начать прямо сейчас →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-muted-foreground text-sm" style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}>
        © 2025 BotFlow. Создавай ботов, которые продают.
      </footer>
    </div>
  );
}
