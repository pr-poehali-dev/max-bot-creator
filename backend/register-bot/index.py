"""
Регистрация Telegram-бота: проверяет токен, настраивает webhook, сохраняет бота в БД.
"""
import json
import os
import urllib.request
import urllib.error
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def tg_api(token: str, method: str, data: dict = None) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    body = json.dumps(data or {}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    token = (body.get("token") or "").strip()
    description = (body.get("description") or "").strip()
    session_id = event.get("headers", {}).get("X-Session-Id", "anonymous")

    if not token:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Токен не указан"})}

    # Проверяем токен через Telegram
    try:
        me = tg_api(token, "getMe")
    except Exception as e:
        err_str = str(e)
        if "401" in err_str or "404" in err_str:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неверный токен. Проверь его в @BotFather"})}
        return {"statusCode": 500, "headers": CORS, "body": json.dumps({"error": f"Ошибка связи с Telegram: {str(e)}"})}

    if not me.get("ok"):
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Telegram отклонил токен"})}

    tg_bot = me["result"]
    bot_username = tg_bot.get("username", "")
    bot_name = tg_bot.get("first_name", bot_username)

    # Получаем URL функции-обработчика из переменной окружения
    webhook_url = os.environ.get("WEBHOOK_URL", "https://functions.poehali.dev/dfca5001-b488-4041-890d-ca1f719ab66a")

    # Генерируем сценарий из описания
    scenario = build_scenario(description, bot_name)

    # Устанавливаем webhook если есть URL
    if webhook_url:
        try:
            tg_api(token, "setWebhook", {"url": f"{webhook_url}?token={token}"})
        except Exception:
            pass  # Webhook не критичен для сохранения

    # Сохраняем в БД
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # Удаляем старую запись с таким же токеном если есть
    cur.execute(
        "DELETE FROM t_p65018350_max_bot_creator.bots WHERE telegram_token = %s",
        (token,)
    )

    cur.execute(
        """INSERT INTO t_p65018350_max_bot_creator.bots
           (user_session, bot_name, telegram_token, telegram_username, description, scenario, status)
           VALUES (%s, %s, %s, %s, %s, %s, 'active')
           RETURNING id""",
        (session_id, bot_name, token, bot_username, description, json.dumps(scenario, ensure_ascii=False))
    )
    bot_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "id": bot_id,
            "bot_name": bot_name,
            "bot_username": bot_username,
            "telegram_link": f"https://t.me/{bot_username}",
            "scenario_steps": len(scenario),
            "status": "active",
        }, ensure_ascii=False)
    }


def build_scenario(description: str, bot_name: str) -> list:
    """Строит сценарий диалога на основе описания пользователя."""
    desc = description.lower()
    scenario = []

    # Приветствие — всегда первое
    scenario.append({
        "trigger": ["start", "привет", "hello", "hi", "начать"],
        "reply": f"Привет! 👋 Я {bot_name}.\n\n{_greeting_text(description)}\n\nЧем могу помочь?"
    })

    # Анализируем описание и добавляем релевантные блоки
    if any(w in desc for w in ["faq", "вопрос", "часто", "помощь", "поддержка", "support"]):
        scenario.append({
            "trigger": ["вопрос", "помощь", "faq", "помоги", "не знаю"],
            "reply": "Отвечу на частые вопросы! Напиши что тебя интересует, и я постараюсь помочь 💬"
        })

    if any(w in desc for w in ["продаж", "купить", "цена", "стоимость", "заказ", "магазин", "товар"]):
        scenario.append({
            "trigger": ["цена", "стоимость", "купить", "заказать", "сколько стоит"],
            "reply": "Расскажу о наших ценах и условиях! Напиши что именно тебя интересует 🛍"
        })
        scenario.append({
            "trigger": ["заказ", "оформить", "оплата"],
            "reply": "Чтобы оформить заказ — напиши что хочешь купить, и я помогу с оформлением ✅"
        })

    if any(w in desc for w in ["запись", "бронир", "встреч", "назначить", "время", "slot", "запис"]):
        scenario.append({
            "trigger": ["запись", "записаться", "бронь", "забронировать", "время"],
            "reply": "Хочешь записаться? Напиши удобное время и дату, и я всё оформлю 📅"
        })

    if any(w in desc for w in ["доставк", "курьер", "привез", "получить", "shipping"]):
        scenario.append({
            "trigger": ["доставка", "доставить", "привезти", "курьер"],
            "reply": "Расскажу о доставке! Обычно доставляем в течение 1-3 дней по всей России 🚚"
        })

    if any(w in desc for w in ["возврат", "обмен", "вернуть", "не подошло"]):
        scenario.append({
            "trigger": ["возврат", "вернуть", "обмен", "не подошло"],
            "reply": "Возврат и обмен — без проблем! Напиши что случилось, и мы решим вопрос 🔄"
        })

    if any(w in desc for w in ["контакт", "телефон", "email", "адрес", "связаться", "оператор"]):
        scenario.append({
            "trigger": ["контакт", "телефон", "связаться", "оператор", "человек"],
            "reply": "Хочешь связаться с живым оператором? Напиши свой вопрос — передам специалисту 👤"
        })

    # Универсальный ответ на непонятные сообщения
    scenario.append({
        "trigger": ["__default__"],
        "reply": f"Я понял твой вопрос! Наш специалист скоро ответит 🙏\n\nИли напиши /help чтобы увидеть что я умею."
    })

    # Помощь
    scenario.append({
        "trigger": ["help", "помощь", "/help", "что умеешь", "команды"],
        "reply": "Вот что я умею:\n\n" + "\n".join([f"• {s['trigger'][0]}" for s in scenario[1:-1]]) + "\n\nПросто напиши любой вопрос!"
    })

    return scenario


def _greeting_text(description: str) -> str:
    if not description:
        return "Я готов помочь с любыми вопросами."
    # Первые 120 символов описания как представление
    short = description[:120].strip()
    if len(description) > 120:
        short += "..."
    return short