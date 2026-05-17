import { useState } from "react";
import { Page } from "../App";
import Icon from "@/components/ui/icon";

interface ConstructorPageProps {
  onNavigate: (page: Page) => void;
}

type Step = "template" | "fill" | "preview" | "publish";

interface BotTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  tags: string[];
  fields: BotField[];
}

interface BotField {
  key: string;
  label: string;
  placeholder: string;
  value: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  hint?: string;
}

interface DialogMessage {
  role: "bot" | "user";
  text: string;
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
      { key: "company", label: "Название компании", placeholder: "ООО Ромашка", value: "", type: "text", required: true },
      { key: "sphere", label: "Сфера деятельности", placeholder: "Интернет-магазин одежды", value: "", type: "text", required: true },
      { key: "tone", label: "Тон общения", placeholder: "", value: "Дружелюбный", type: "select", options: ["Дружелюбный", "Официальный", "Молодёжный", "Нейтральный"] },
      { key: "faq_topics", label: "О чём чаще всего спрашивают клиенты", placeholder: "Доставка, возврат, размеры, оплата", value: "", type: "textarea", required: true, hint: "Перечисли через запятую — бот будет отвечать на каждый вопрос" },
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
      { key: "company", label: "Название компании", placeholder: "ООО Ромашка", value: "", type: "text", required: true },
      { key: "product", label: "Продукт или услуга", placeholder: "Приложение для учёта финансов", value: "", type: "text", required: true },
      { key: "issues", label: "Частые проблемы пользователей", placeholder: "Не могу войти, не работает оплата, ошибка при регистрации", value: "", type: "textarea", required: true, hint: "Бот будет предлагать решения по каждой из них" },
      { key: "escalation", label: "Когда передавать оператору", placeholder: "Технические баги, жалобы, VIP-клиенты", value: "", type: "textarea", hint: "Если клиент попадёт в эту ситуацию — бот переключит на человека" },
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
      { key: "company", label: "Название компании", placeholder: "ООО Ромашка", value: "", type: "text", required: true },
      { key: "product", label: "Что продаёте", placeholder: "CRM-система для малого бизнеса", value: "", type: "text", required: true },
      { key: "audience", label: "Целевая аудитория", placeholder: "Владельцы малого бизнеса, 25-45 лет", value: "", type: "text", hint: "Бот будет квалифицировать лидов под этот портрет" },
      { key: "price", label: "Ценовой диапазон", placeholder: "от 990 руб/мес", value: "", type: "text" },
      { key: "benefits", label: "Главные преимущества", placeholder: "Экономит 3 часа в день, интеграция с 1С, поддержка 24/7", value: "", type: "textarea", required: true, hint: "Бот будет презентовать их клиенту" },
      { key: "cta", label: "Целевое действие", placeholder: "Записаться на демо / Купить / Получить скидку", value: "", type: "text", required: true },
    ],
  },
];

const CHANNELS = [
  { id: "telegram", name: "Telegram", icon: "Send", color: "#0088cc" },
  { id: "whatsapp", name: "WhatsApp", icon: "MessageCircle", color: "#25d366" },
  { id: "vk", name: "ВКонтакте", icon: "Users", color: "#4c75a3" },
  { id: "website", name: "Сайт (виджет)", icon: "Globe", color: "#8b5cf6" },
];

function generateDialog(template: BotTemplate, fields: BotField[]): DialogMessage[] {
  const get = (key: string) => fields.find((f) => f.key === key)?.value.trim() || "";
  const company = get("company") || "наша компания";
  const tone = get("tone") || "Дружелюбный";
  const greeting = tone === "Официальный" ? "Добрый день" : tone === "Молодёжный" ? "Привет" : "Привет";

  if (template.id === "faq") {
    const sphere = get("sphere") || "наш бизнес";
    const topics = get("faq_topics");
    const contacts = get("contacts");
    const topicList = topics ? topics.split(/[,;]\s*/).filter(Boolean).slice(0, 4) : ["доставка", "оплата", "возврат"];

    return [
      { role: "bot", text: `${greeting}! 👋 Я виртуальный помощник компании ${company}.\n\nЧем могу помочь? Выбери тему:` },
      { role: "user", text: topicList[0] || "Как оформить заказ?" },
      { role: "bot", text: `Отличный вопрос о «${topicList[0]}»!\n\nМы работаем в сфере: ${sphere}. Обычно по этой теме всё очень просто — наши специалисты всегда готовы помочь.\n\nЕсть ещё вопросы? Могу рассказать про: ${topicList.slice(1).join(", ") || "другие темы"}.` },
      { role: "user", text: topicList[1] || "Хочу связаться с оператором" },
      { role: "bot", text: contacts ? `Конечно! Вот контакты для связи с живым оператором:\n\n📞 ${contacts}\n\nОни ответят быстро!` : `Сейчас соединю вас с оператором. Ожидайте, пожалуйста — обычно мы отвечаем в течение нескольких минут. 🙏` },
    ];
  }

  if (template.id === "support") {
    const product = get("product") || "наш продукт";
    const issues = get("issues");
    const sla = get("sla");
    const issueList = issues ? issues.split(/[,;]\s*/).filter(Boolean).slice(0, 3) : ["не могу войти", "ошибка оплаты"];

    return [
      { role: "bot", text: `${greeting}! 👋 Я служба поддержки ${company}.\n\nС каким продуктом нужна помощь?\n➡ ${product}` },
      { role: "user", text: issueList[0] || "Не могу войти в аккаунт" },
      { role: "bot", text: `Понимаю, это неприятно 😔 Давай разберёмся!\n\nПо проблеме «${issueList[0]}» обычно помогает:\n\n1. Проверь интернет-соединение\n2. Попробуй сбросить пароль\n3. Очисти кэш браузера\n\nПомогло?` },
      { role: "user", text: "Нет, ничего не помогает" },
      { role: "bot", text: `Тогда передаю заявку оператору — он решит это лично для тебя.${sla ? `\n\n⏱ Время ответа: ${sla}` : ""}\n\nОпиши проблему подробнее, чтобы оператор сразу всё понял 👇` },
    ];
  }

  if (template.id === "sales") {
    const product = get("product") || "наш продукт";
    const benefits = get("benefits");
    const price = get("price");
    const cta = get("cta") || "Оставить заявку";
    const benefitList = benefits ? benefits.split(/[,;]\s*/).filter(Boolean).slice(0, 3) : [];
    const audience = get("audience");

    return [
      { role: "bot", text: `${greeting}! 👋 Я помогу тебе узнать всё о ${product} от ${company}.\n\nЧем занимаешься?${audience ? `\n(Мы работаем с: ${audience})` : ""}` },
      { role: "user", text: "Расскажи подробнее о продукте" },
      { role: "bot", text: `С удовольствием! 🚀 Вот что делает ${product} особенным:\n\n${benefitList.map((b, i) => `${["✅", "⚡", "🎯"][i] || "•"} ${b}`).join("\n") || "• Высокое качество\n• Удобный интерфейс\n• Поддержка 24/7"}${price ? `\n\n💰 Стоимость: ${price}` : ""}` },
      { role: "user", text: "Хочу попробовать" },
      { role: "bot", text: `Отлично! 🎉 Один шаг до старта:\n\n👉 ${cta}\n\nОставь контакт — мы свяжемся в течение 15 минут!` },
    ];
  }

  return [];
}

const STEPS: { id: Step; label: string }[] = [
  { id: "template", label: "Шаблон" },
  { id: "fill", label: "Данные" },
  { id: "preview", label: "Превью" },
  { id: "publish", label: "Запуск" },
];

export default function ConstructorPage({ onNavigate }: ConstructorPageProps) {
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null);
  const [fields, setFields] = useState<BotField[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["telegram"]);
  const [botName, setBotName] = useState("");
  const [publishDone, setPublishDone] = useState(false);
  const [generatedBots, setGeneratedBots] = useState<{ name: string; template: string; channels: string[] }[]>([]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handleSelectTemplate = (tpl: BotTemplate) => {
    setSelectedTemplate(tpl);
    setFields(tpl.fields.map((f) => ({ ...f })));
    setBotName(tpl.name);
    setPublishDone(false);
    setStep("fill");
  };

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)));
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const requiredFilled = fields.filter((f) => f.required).every((f) => f.value.trim().length > 0);

  const dialog: DialogMessage[] = selectedTemplate ? generateDialog(selectedTemplate, fields) : [];

  const handlePublish = () => {
    if (!selectedTemplate) return;
    setGeneratedBots((prev) => [
      ...prev,
      {
        name: botName,
        template: selectedTemplate.name,
        channels: selectedChannels,
      },
    ]);
    setPublishDone(true);
  };

  const handleReset = () => {
    setStep("template");
    setSelectedTemplate(null);
    setFields([]);
    setBotName("");
    setPublishDone(false);
    setSelectedChannels(["telegram"]);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center animate-fade-in-up">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-wider mb-3">
          <span className="gradient-text">Конструктор</span>{" "}
          <span className="text-foreground">ботов</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Заполни данные о своём бизнесе — бот готов к запуску
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-px" style={{ background: "rgba(139,92,246,0.2)" }} />
          <div
            className="absolute top-5 left-0 h-px transition-all duration-700"
            style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)", width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((s, i) => (
            <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
                style={i <= stepIndex
                  ? { background: "linear-gradient(135deg, #8b5cf6, #22d3ee)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.3)", color: "rgba(255,255,255,0.3)" }}
              >
                {i < stepIndex ? <Icon name="Check" size={16} /> : i + 1}
              </div>
              <span className="text-xs font-medium" style={{ color: i <= stepIndex ? "#e2e8f0" : "rgba(255,255,255,0.3)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP: Template */}
      {step === "template" && (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Выбери тип бота</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className="group text-left rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] card-glow"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: tpl.gradient }}>
                  {/* @ts-expect-error dynamic icon */}
                  <Icon name={tpl.icon} size={28} className="text-white" />
                </div>
                <h3 className="font-oswald text-xl font-bold text-foreground mb-2 uppercase tracking-wide">{tpl.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{tpl.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tpl.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: "rgba(139,92,246,0.15)", color: tpl.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: tpl.color }}>
                  Выбрать <Icon name="ArrowRight" size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP: Fill */}
      {step === "fill" && selectedTemplate && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedTemplate.gradient }}>
              {/* @ts-expect-error dynamic icon */}
              <Icon name={selectedTemplate.icon} size={20} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{selectedTemplate.name}</div>
              <div className="text-xs text-muted-foreground">Заполни данные о своём бизнесе</div>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                  {field.label}
                  {field.required && <span style={{ color: "#ec4899" }}>*</span>}
                </label>
                {field.hint && (
                  <p className="text-xs text-muted-foreground mb-2">{field.hint}</p>
                )}
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.2)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.2)")}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none"
                    style={{ background: "rgba(30,20,50,0.9)", border: "1px solid rgba(139,92,246,0.2)" }}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt} style={{ background: "#0f0a1e" }}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.2)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.2)")}
                  />
                )}
              </div>
            ))}
          </div>

          {!requiredFilled && (
            <p className="text-xs mb-4" style={{ color: "#f59e0b" }}>
              ⚠ Заполни обязательные поля (отмечены *) чтобы продолжить
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep("template")}
              className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Назад
            </button>
            <button
              onClick={() => setStep("preview")}
              disabled={!requiredFilled}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              Посмотреть превью →
            </button>
          </div>
        </div>
      )}

      {/* STEP: Preview */}
      {step === "preview" && selectedTemplate && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-xl font-semibold text-foreground mb-2 text-center">Так будет выглядеть диалог с ботом</h2>
          <p className="text-muted-foreground text-sm text-center mb-8">На основе твоих данных — живой пример разговора</p>

          {/* Bot name */}
          <div className="mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: "16px 20px" }}>
            <label className="block text-sm font-medium text-foreground mb-2">Название бота</label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.2)" }}
            />
          </div>

          {/* Chat preview */}
          <div className="rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid rgba(139,92,246,0.25)" }}>
            {/* Chat header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: "rgba(139,92,246,0.12)", borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: selectedTemplate.gradient }}>
                {/* @ts-expect-error dynamic icon */}
                <Icon name={selectedTemplate.icon} size={18} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{botName}</div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#10b981" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  онлайн
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4" style={{ background: "rgba(10,10,18,0.6)", minHeight: 240 }}>
              {dialog.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                    style={msg.role === "bot"
                      ? { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)", color: "#e2e8f0", borderBottomLeftRadius: 4 }
                      : { background: "linear-gradient(135deg, #8b5cf6, #6366f1)", color: "#fff", borderBottomRightRadius: 4 }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <label className="block text-sm font-medium text-foreground mb-4">Каналы подключения</label>
            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((ch) => {
                const active = selectedChannels.includes(ch.id);
                return (
                  <button key={ch.id} onClick={() => toggleChannel(ch.id)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
                    style={{
                      background: active ? `${ch.color}22` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${active ? ch.color + "66" : "rgba(255,255,255,0.08)"}`,
                      color: active ? ch.color : "rgba(255,255,255,0.5)",
                    }}>
                    {/* @ts-expect-error dynamic icon */}
                    <Icon name={ch.icon} size={18} />
                    {ch.name}
                    {active && <Icon name="Check" size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("fill")}
              className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Изменить данные
            </button>
            <button onClick={() => setStep("publish")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              Запустить бота 🚀
            </button>
          </div>
        </div>
      )}

      {/* STEP: Publish */}
      {step === "publish" && (
        <div className="max-w-lg mx-auto animate-fade-in-up text-center">
          {!publishDone ? (
            <>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
                <Icon name="Rocket" size={48} className="text-white" />
              </div>
              <h2 className="font-oswald text-3xl font-bold uppercase tracking-wider text-foreground mb-3">Почти готово!</h2>
              <p className="text-muted-foreground mb-8">
                Бот <span className="text-foreground font-medium">«{botName}»</span> настроен на основе твоих данных и готов к запуску.
              </p>

              <div className="rounded-2xl p-5 mb-8 text-left space-y-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}>
                {[
                  { label: "Шаблон", value: selectedTemplate?.name },
                  { label: "Название", value: botName },
                  { label: "Каналы", value: selectedChannels.map((id) => CHANNELS.find((c) => c.id === id)?.name).filter(Boolean).join(", ") },
                  { label: "Сообщений в сценарии", value: `${dialog.length} реплик` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="text-foreground font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("preview")}
                  className="px-5 py-3 rounded-xl text-sm font-medium text-muted-foreground"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Назад
                </button>
                <button onClick={handlePublish}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white btn-glow hover:scale-[1.02] transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
                  🚀 Запустить бота
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in-up">
              <div className="relative mx-auto w-28 h-28 mb-6">
                <div className="absolute inset-0 rounded-full opacity-30 animate-pulse"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #10b981)" }} />
                <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #10b981)" }}>
                  <Icon name="CheckCircle" size={56} className="text-white" />
                </div>
              </div>
              <h2 className="font-oswald text-3xl font-bold uppercase tracking-wider gradient-text mb-3">Бот запущен!</h2>
              <p className="text-muted-foreground mb-8">
                <span className="text-foreground font-medium">«{botName}»</span> успешно создан со сценарием из {dialog.length} реплик
              </p>

              {generatedBots.length > 0 && (
                <div className="rounded-2xl p-5 mb-8 text-left"
                  style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.25)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="Bot" size={16} style={{ color: "#10b981" }} />
                    <span className="text-sm font-medium" style={{ color: "#10b981" }}>Созданные боты</span>
                  </div>
                  {generatedBots.map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm border-b last:border-b-0"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="text-foreground font-medium">«{b.name}»</span>
                      <span className="text-muted-foreground">{b.template} · {b.channels.join(", ")}</span>
                    </div>
                  ))}
                </div>
              )}

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
      )}
    </div>
  );
}
