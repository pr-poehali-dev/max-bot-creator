"""
Обработчик входящих сообщений от Telegram. Получает update, находит бота в БД, отвечает по сценарию.
"""
import json
import os
import urllib.request
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def tg_send(token: str, chat_id: int, text: str):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    body = json.dumps({"chat_id": chat_id, "text": text, "parse_mode": "HTML"}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    urllib.request.urlopen(req, timeout=10)


def match_trigger(text: str, triggers: list) -> bool:
    text_lower = text.lower().strip()
    for t in triggers:
        if t == "__default__":
            continue
        if t.startswith("/"):
            if text_lower == t:
                return True
        else:
            if t in text_lower:
                return True
    return False


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    # Токен передаётся как query param: ?token=xxx
    token = (event.get("queryStringParameters") or {}).get("token", "")
    if not token:
        return {"statusCode": 400, "headers": CORS, "body": "No token"}

    body = json.loads(event.get("body") or "{}")
    message = body.get("message") or body.get("edited_message")
    if not message:
        return {"statusCode": 200, "headers": CORS, "body": "ok"}

    chat_id = message["chat"]["id"]
    text = message.get("text", "")

    # Загружаем сценарий из БД
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "SELECT scenario FROM t_p65018350_max_bot_creator.bots WHERE telegram_token = %s AND status = 'active'",
        (token,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {"statusCode": 200, "headers": CORS, "body": "ok"}

    scenario = row[0] if isinstance(row[0], list) else json.loads(row[0])

    # Ищем подходящий ответ
    reply_text = None
    default_reply = None

    for step in scenario:
        triggers = step.get("trigger", [])
        if "__default__" in triggers:
            default_reply = step.get("reply", "")
            continue
        if match_trigger(text, triggers):
            reply_text = step.get("reply", "")
            break

    if reply_text is None:
        reply_text = default_reply or "Не совсем понял. Напиши /help — покажу что умею 🤖"

    try:
        tg_send(token, chat_id, reply_text)
    except Exception as e:
        pass

    return {"statusCode": 200, "headers": CORS, "body": "ok"}
