import { useState } from "react";
import { Page } from "../App";
import Icon from "@/components/ui/icon";

interface ConstructorPageProps {
  onNavigate: (page: Page) => void;
}

type Step = "template" | "ai-fill" | "customize" | "publish";

interface BotTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  tags: string[];
  fields: AiField[];
}

interface AiField {
  key: string;
  label: string;
  placeholder: string;
  value: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

const TEMPLATES: BotTemplate[] = [
  {
    id: "faq",
    name: "FAQ-бот",
    description: "Автоматически отвечает на частые вопросы клиентов 24/7",
    icon: "MessageCircleQuestion",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    tags: ["Быстрый старт", "Популярный"],
    fields: [
      { key: "company", label: "Название компании", placeholder: "ООО Ромашка", value: "", type: "text" },
      { key: "sphere", label: "Сфера деятельности", placeholder: "Интернет-магазин одежды", value: "", type: "text" },
      { key: "tone", label: "Тон общения", placeholder: "", value: "Дружелюбный", type: "select", options: ["Дружелюбный", "Официальный", "Молодёжный", "Нейтральный"] },
      { key: "faq_topics", label: "О чём чаще всего спрашивают клиенты", placeholder: "Доставка, возврат, размеры, оплата", value: "", type: "textarea" },
      { key: "contacts", label: "Контакты для связи с оператором", placeholder: "support@example.com или +7 999 123-45-67", value: "", type: "text" },
    ],
  },
  {
    id: "support",
    name: "Поддержка",
    description: "Принимает заявки, решает проблемы, эскалирует сложные случаи",
    icon: "Headphones",
    color: "#22d3ee",
    gradient: "linear-gradient(135deg, #22d3ee, #0ea5e9)",
    tags: ["Сервис", "Заявки"],
    fields: [
      { key: "company", label: "Название компании", placeholder: "ООО Ромашка", value: "", type: "text" },
      { key: "product", label: "Продукт или услуга", placeholder: "Приложение для учёта финансов", value: "", type: "text" },
      { key: "issues", label: "Частые проблемы пользователей", placeholder: "Не могу войти, не работает оплата, ошибка при регистрации", value: "", type: "textarea" },
      { key: "escalation", label: "Когда передавать оператору", placeholder: "Технические баги, жалобы, VIP-клиенты", value: "", type: "textarea" },
      { key: "sla", label: "Время ответа оператора", placeholder: "В течение 2 часов в рабочее время", value: "", type: "text" },
    ],
  },
  {
    id: "sales",
    name: "Продажи",
    description: "Квалифицирует лиды, презентует продукт, ведёт до покупки",
    icon: "TrendingUp",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #f97316)",
    tags: ["Лиды", "Конверсия"],
    fields: [
      { key: "company", label: "Название компании", placeholder: "ООО Ромашка", value: "", type: "text" },
      { key: "product", label: "Что продаёте", placeholder: "CRM-система для малого бизнеса", value: "", type: "text" },
      { key: "audience", label: "Целевая аудитория", placeholder: "Владельцы малого бизнеса, 25-45 лет", value: "", type: "text" },
      { key: "price", label: "Ценовой диапазон", placeholder: "от 990 руб/мес", value: "", type: "text" },
      { key: "benefits", label: "Главные преимущества продукта", placeholder: "Экономит 3 часа в день, интеграция с 1С, поддержка 24/7", value: "", type: "textarea" },
      { key: "cta", label: "Целевое действие", placeholder: "Записаться на демо / Купить / Получить скидку", value: "", type: "text" },
    ],
  },
];

const AI_SUGGESTIONS: Record<string, Record<string, string>> = {
  faq: {
    company: "«ТвойМагазин»",
    sphere: "Интернет-магазин товаров для дома",
    tone: "Дружелюбный",
    faq_topics: "Сроки и стоимость доставки, условия возврата, как оформить заказ, способы оплаты, наличие товаров",
    contacts: "support@tvoymagazin.ru или Telegram @tvoymagazin_support",
  },
  support: {
    company: "«СофтПро»",
    product: "Облачный сервис для управления задачами",
    issues: "Не получается войти в аккаунт, забыл пароль, ошибка при создании проекта, не приходит письмо с подтверждением",
    escalation: "Проблемы с оплатой, недоступность сервиса, корпоративные клиенты, повторные обращения",
    sla: "До 1 часа в рабочее время (9:00–18:00 МСК)",
  },
  sales: {
    company: "«РостБизнес»",
    product: "Платформа автоматизации маркетинга",
    audience: "Маркетологи и владельцы бизнеса, 28–50 лет, малый и средний бизнес",
    price: "от 1 990 руб/мес, бесплатный пробный период 14 дней",
    benefits: "Автоматическая рассылка, аналитика в реальном времени, интеграция с CRM, экономия 5+ часов в неделю",
    cta: "Попробовать бесплатно 14 дней",
  },
};

const CHANNELS = [
  { id: "telegram", name: "Telegram", icon: "Send", color: "#0088cc" },
  { id: "whatsapp", name: "WhatsApp", icon: "MessageCircle", color: "#25d366" },
  { id: "vk", name: "ВКонтакте", icon: "Users", color: "#4c75a3" },
  { id: "website", name: "Сайт (виджет)", icon: "Globe", color: "#8b5cf6" },
];

export default function ConstructorPage({ onNavigate }: ConstructorPageProps) {
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null);
  const [fields, setFields] = useState<AiField[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["telegram"]);
  const [botName, setBotName] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [publishDone, setPublishDone] = useState(false);

  const handleSelectTemplate = (tpl: BotTemplate) => {
    setSelectedTemplate(tpl);
    setFields(tpl.fields.map((f) => ({ ...f })));
    setBotName(tpl.name);
    setAiDone(false);
    setStep("ai-fill");
  };

  const handleAiFill = () => {
    if (!selectedTemplate) return;
    setIsAiThinking(true);
    const suggestions = AI_SUGGESTIONS[selectedTemplate.id] || {};
    setTimeout(() => {
      setFields((prev) =>
        prev.map((f) => ({
          ...f,
          value: suggestions[f.key] !== undefined ? suggestions[f.key] : f.value,
        }))
      );
      setIsAiThinking(false);
      setAiDone(true);
    }, 1800);
  };

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)));
  };

  const handlePublish = () => {
    setPublishDone(true);
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const STEPS: { id: Step; label: string }[] = [
    { id: "template", label: "Шаблон" },
    { id: "ai-fill", label: "Данные" },
    { id: "customize", label: "Настройка" },
    { id: "publish", label: "Запуск" },
  ];

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center animate-fade-in-up">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-wider mb-3">
          <span className="gradient-text">Конструктор</span>{" "}
          <span className="text-foreground">ботов</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Выбери шаблон — ИИ заполнит всё остальное за 30 секунд
        </p>
      </div>

      {/* Steps progress */}
      <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
        <div className="flex items-center justify-between relative">
          <div
            className="absolute top-5 left-0 right-0 h-px"
            style={{ background: "rgba(139,92,246,0.2)" }}
          />
          <div
            className="absolute top-5 left-0 h-px transition-all duration-700"
            style={{
              background: "linear-gradient(90deg, #8b5cf6, #22d3ee)",
              width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
          {STEPS.map((s, i) => (
            <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
                style={
                  i <= stepIndex
                    ? { background: "linear-gradient(135deg, #8b5cf6, #22d3ee)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.3)", color: "rgba(255,255,255,0.3)" }
                }
              >
                {i < stepIndex ? <Icon name="Check" size={16} /> : i + 1}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: i <= stepIndex ? "#e2e8f0" : "rgba(255,255,255,0.3)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step: Template */}
      {step === "template" && (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            Выбери тип бота
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className="group text-left rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] card-glow"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: tpl.gradient }}
                >
                                    {/* @ts-expect-error dynamic icon name */}
                  <Icon name={tpl.icon} size={28} className="text-white" />
                </div>
                <h3 className="font-oswald text-xl font-bold text-foreground mb-2 uppercase tracking-wide">
                  {tpl.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {tpl.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: "rgba(139,92,246,0.15)", color: tpl.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: tpl.color }}
                >
                  Выбрать шаблон <Icon name="ArrowRight" size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: AI Fill */}
      {step === "ai-fill" && selectedTemplate && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          {/* AI Banner */}
          <div
            className="rounded-2xl p-6 mb-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.1))",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
                >
                  <Icon name="Sparkles" size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">ИИ-помощник</div>
                  <div className="text-xs text-muted-foreground">Заполняет данные за тебя</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Нажми кнопку — ИИ сгенерирует типичный пример заполнения. Потом ты сможешь отредактировать под себя.
              </p>
              <button
                onClick={handleAiFill}
                disabled={isAiThinking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
              >
                {isAiThinking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ИИ думает...
                  </>
                ) : aiDone ? (
                  <>
                    <Icon name="RefreshCw" size={15} />
                    Заполнить снова
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={15} />
                    Заполнить с помощью ИИ
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5 mb-8">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.2)")}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt} style={{ background: "#0a0a12" }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.2)")}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("template")}
              className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Назад
            </button>
            <button
              onClick={() => setStep("customize")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
            >
              Продолжить →
            </button>
          </div>
        </div>
      )}

      {/* Step: Customize */}
      {step === "customize" && selectedTemplate && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            Настройка бота
          </h2>

          {/* Bot name */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Название бота
            </label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            />
          </div>

          {/* Channels */}
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <label className="block text-sm font-medium text-foreground mb-4">
              Каналы подключения
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((ch) => {
                const active = selectedChannels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
                    style={{
                      background: active ? `${ch.color}22` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${active ? ch.color + "66" : "rgba(255,255,255,0.08)"}`,
                      color: active ? ch.color : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {/* @ts-expect-error dynamic icon name */}
                    <Icon name={ch.icon} size={18} />
                    {ch.name}
                    {active && <Icon name="Check" size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Eye" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Превью — первое сообщение бота</span>
            </div>
            <div
              className="rounded-xl p-4 text-sm text-foreground leading-relaxed"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}
            >
              👋 Привет! Я {botName || "бот"} — ваш виртуальный помощник
              {fields.find((f) => f.key === "company")?.value
                ? ` от ${fields.find((f) => f.key === "company")?.value}`
                : ""}.{" "}
              {selectedTemplate.id === "faq" && "Готов ответить на ваши вопросы!"}
              {selectedTemplate.id === "support" && "Помогу решить любой вопрос быстро и удобно!"}
              {selectedTemplate.id === "sales" && "Расскажу всё о нашем продукте и помогу сделать выбор!"}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("ai-fill")}
              className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Назад
            </button>
            <button
              onClick={() => setStep("publish")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
            >
              Запустить бота →
            </button>
          </div>
        </div>
      )}

      {/* Step: Publish */}
      {step === "publish" && (
        <div className="max-w-lg mx-auto animate-fade-in-up text-center">
          {!publishDone ? (
            <>
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
              >
                <Icon name="Rocket" size={48} className="text-white" />
              </div>
              <h2 className="font-oswald text-3xl font-bold uppercase tracking-wider text-foreground mb-3">
                Почти готово!
              </h2>
              <p className="text-muted-foreground mb-2">
                Бот <span className="text-foreground font-medium">«{botName}»</span> готов к запуску.
              </p>
              <p className="text-muted-foreground text-sm mb-8">
                После запуска он появится в разделе «Мои боты» и будет доступен для подключения к каналам.
              </p>

              {/* Summary */}
              <div
                className="rounded-2xl p-5 mb-8 text-left space-y-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Шаблон</span>
                  <span className="text-foreground font-medium">{selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Название</span>
                  <span className="text-foreground font-medium">{botName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Каналы</span>
                  <span className="text-foreground font-medium">
                    {selectedChannels
                      .map((id) => CHANNELS.find((c) => c.id === id)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("customize")}
                  className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Назад
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white btn-glow transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
                >
                  🚀 Запустить бота
                </button>
              </div>
            </>
          ) : (
            /* Success */
            <div className="animate-fade-in-up">
              <div className="relative mx-auto w-28 h-28 mb-6">
                <div
                  className="absolute inset-0 rounded-full opacity-30 animate-pulse"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #10b981)" }}
                />
                <div
                  className="relative w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #10b981)" }}
                >
                  <Icon name="CheckCircle" size={56} className="text-white" />
                </div>
              </div>
              <h2 className="font-oswald text-3xl font-bold uppercase tracking-wider gradient-text mb-3">
                Бот запущен!
              </h2>
              <p className="text-muted-foreground mb-8">
                <span className="text-foreground font-medium">«{botName}»</span> успешно создан и готов к работе
              </p>

              <div
                className="rounded-2xl p-5 mb-8 text-left"
                style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Sparkles" size={16} style={{ color: "#10b981" }} />
                  <span className="text-sm font-medium" style={{ color: "#10b981" }}>Что дальше?</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} style={{ color: "#10b981" }} />
                    Подключить токен Telegram / WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} style={{ color: "#10b981" }} />
                    Настроить сценарии диалогов
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} style={{ color: "#10b981" }} />
                    Протестировать бота
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("template");
                    setSelectedTemplate(null);
                    setFields([]);
                    setAiDone(false);
                    setPublishDone(false);
                    setBotName("");
                  }}
                  className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Создать ещё
                </button>
                <button
                  onClick={() => onNavigate("mybots")}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white btn-glow"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
                >
                  Перейти к моим ботам →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}