import { useState } from "react";
import { Page } from "../App";
import Icon from "@/components/ui/icon";
import { registerBot } from "@/lib/api";

interface Props {
  onNavigate: (page: Page) => void;
}

type Step = "token" | "describe" | "launching" | "done";

const EXAMPLES = [
  "Бот для кофейни: отвечает на вопросы о меню, принимает предзаказы, сообщает время работы",
  "FAQ-бот для интернет-магазина: доставка, возврат, оплата, статус заказа",
  "Бот поддержки SaaS: помогает с ошибками входа, сброса пароля, передаёт сложные вопросы оператору",
  "Продающий бот для курсов: рассказывает о программе, ценах, предлагает записаться",
];

const STEPS: { id: Step; label: string }[] = [
  { id: "token", label: "Telegram-токен" },
  { id: "describe", label: "Описание" },
  { id: "launching", label: "Запуск" },
  { id: "done", label: "Готово" },
];

export default function ConstructorPage({ onNavigate }: Props) {
  const [step, setStep] = useState<Step>("token");
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    bot_name: string;
    bot_username: string;
    telegram_link: string;
    scenario_steps: number;
  } | null>(null);
  const [error, setError] = useState("");

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handleTokenNext = () => {
    const clean = token.trim();
    if (!clean) { setTokenError("Вставь токен от @BotFather"); return; }
    if (!clean.includes(":")) { setTokenError("Токен выглядит неверно — должен содержать \":\""); return; }
    setTokenError("");
    setStep("describe");
  };

  const handleLaunch = async () => {
    if (!description.trim()) return;
    setStep("launching");
    setIsLoading(true);
    setError("");
    try {
      const data = await registerBot(token.trim(), description.trim());
      setResult(data);
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      setStep("describe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("token");
    setToken("");
    setDescription("");
    setResult(null);
    setError("");
    setTokenError("");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto mb-10 text-center animate-fade-in-up">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-wider mb-3">
          <span className="gradient-text">Создай</span>{" "}
          <span className="text-foreground">своего бота</span>
        </h1>
        <p className="text-muted-foreground text-lg">Опиши что нужно — бот заработает в Telegram через минуту</p>
      </div>

      {/* Steps */}
      <div className="max-w-xl mx-auto mb-12 animate-fade-in">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-px" style={{ background: "rgba(139,92,246,0.2)" }} />
          <div className="absolute top-5 left-0 h-px transition-all duration-700"
            style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)", width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }} />
          {STEPS.map((s, i) => (
            <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
                style={i <= stepIndex
                  ? { background: "linear-gradient(135deg, #8b5cf6, #22d3ee)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.3)", color: "rgba(255,255,255,0.3)" }}>
                {i < stepIndex ? <Icon name="Check" size={16} /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block"
                style={{ color: i <= stepIndex ? "#e2e8f0" : "rgba(255,255,255,0.3)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Token */}
      {step === "token" && (
        <div className="max-w-xl mx-auto animate-fade-in-up">
          <div className="rounded-2xl p-5 mb-6"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Info" size={16} style={{ color: "#8b5cf6" }} />
              <span className="text-sm font-semibold text-foreground">Как получить токен бесплатно?</span>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-purple-400 font-bold">1.</span>Открой Telegram → найди <span className="text-foreground font-medium">@BotFather</span></li>
              <li className="flex gap-2"><span className="text-purple-400 font-bold">2.</span>Напиши <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}>/newbot</code> и придумай имя боту</li>
              <li className="flex gap-2"><span className="text-purple-400 font-bold">3.</span>BotFather пришлёт токен — скопируй и вставь ниже</li>
            </ol>
          </div>

          <label className="block text-sm font-medium text-foreground mb-2">Telegram-токен от @BotFather</label>
          <input
            type="text"
            value={token}
            onChange={(e) => { setToken(e.target.value); setTokenError(""); }}
            placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
            className="w-full rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${tokenError ? "#ec4899" : "rgba(139,92,246,0.2)"}` }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={(e) => (e.target.style.borderColor = tokenError ? "#ec4899" : "rgba(139,92,246,0.2)")}
            onKeyDown={(e) => e.key === "Enter" && handleTokenNext()}
          />
          {tokenError && <p className="text-xs mt-2" style={{ color: "#ec4899" }}>⚠ {tokenError}</p>}

          <button onClick={handleTokenNext}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-5 btn-glow transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}>
            Продолжить →
          </button>
        </div>
      )}

      {/* STEP 2: Describe */}
      {step === "describe" && (
        <div className="max-w-xl mx-auto animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <Icon name="CheckCircle" size={20} style={{ color: "#10b981" }} />
            <div>
              <div className="text-sm font-semibold text-foreground">Токен принят</div>
              <div className="text-xs text-muted-foreground font-mono">{token.slice(0, 10)}...{token.slice(-6)}</div>
            </div>
            <button onClick={() => setStep("token")} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">
              Изменить
            </button>
          </div>

          <label className="block text-sm font-semibold text-foreground mb-1">Опиши своего бота</label>
          <p className="text-xs text-muted-foreground mb-3">Пиши как человеку — чем подробнее, тем умнее получится бот</p>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Например: бот для моей пиццерии. Отвечает на вопросы о меню, составе пицц, ценах. Принимает заказы и передаёт оператору. Время доставки — 45 минут."
            className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none transition-all mb-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.2)" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.2)")}
          />

          <p className="text-xs text-muted-foreground mb-2">Примеры — нажми чтобы вставить:</p>
          <div className="space-y-2 mb-5">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setDescription(ex)}
                className="w-full text-left text-xs px-3 py-2 rounded-lg transition-all hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                {ex}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm"
              style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", color: "#f9a8d4" }}>
              ⚠ {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep("token")}
              className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Назад
            </button>
            <button onClick={handleLaunch} disabled={!description.trim() || isLoading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed btn-glow"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              🚀 Создать и запустить бота
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Launching */}
      {step === "launching" && (
        <div className="max-w-sm mx-auto text-center animate-fade-in-up py-16">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full opacity-20 animate-pulse"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}>
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          </div>
          <h2 className="font-oswald text-2xl font-bold uppercase text-foreground mb-2">Создаю бота...</h2>
          <p className="text-muted-foreground text-sm">Проверяем токен, строим сценарий, подключаем к Telegram</p>
        </div>
      )}

      {/* STEP 4: Done */}
      {step === "done" && result && (
        <div className="max-w-xl mx-auto animate-fade-in-up text-center">
          <div className="relative mx-auto w-28 h-28 mb-6">
            <div className="absolute inset-0 rounded-full opacity-30 animate-pulse"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #10b981)" }} />
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #10b981)" }}>
              <Icon name="CheckCircle" size={56} className="text-white" />
            </div>
          </div>

          <h2 className="font-oswald text-3xl font-bold uppercase tracking-wider gradient-text mb-1">Бот запущен!</h2>
          <p className="text-muted-foreground mb-6">Он уже работает в Telegram и отвечает на сообщения</p>

          <a href={result.telegram_link} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4 mb-6 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, rgba(0,136,204,0.2), rgba(0,136,204,0.1))", border: "1px solid rgba(0,136,204,0.4)" }}>
            <div className="flex items-center gap-3">
              <Icon name="Send" size={22} style={{ color: "#0088cc" }} />
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">{result.bot_name}</div>
                <div className="text-xs" style={{ color: "#0088cc" }}>@{result.bot_username}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#0088cc" }}>
              Открыть в Telegram <Icon name="ExternalLink" size={14} />
            </div>
          </a>

          <div className="rounded-2xl p-5 mb-6 text-left space-y-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}>
            {[
              { label: "Название", value: result.bot_name },
              { label: "Username", value: `@${result.bot_username}` },
              { label: "Сценариев", value: `${result.scenario_steps} реплик` },
              { label: "Статус", value: "● Активен", color: "#10b981" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium" style={{ color: row.color || "#e2e8f0" }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 mb-6 text-left text-sm text-muted-foreground"
            style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <p className="font-medium text-foreground mb-1">Что делать дальше?</p>
            <p>Открой ссылку выше → напиши боту <code className="px-1 rounded text-xs" style={{ background: "rgba(255,255,255,0.1)" }}>/start</code> → он ответит!</p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleReset}
              className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Создать ещё
            </button>
            <button onClick={() => onNavigate("mybots")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white btn-glow"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}>
              Мои боты →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
