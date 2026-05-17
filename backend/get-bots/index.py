"""
Возвращает список ботов текущего пользователя по session_id.
"""
import json
import os
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    session_id = event.get("headers", {}).get("X-Session-Id", "anonymous")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        """SELECT id, bot_name, telegram_username, description, status, created_at,
                  jsonb_array_length(scenario) as scenario_steps
           FROM t_p65018350_max_bot_creator.bots
           WHERE user_session = %s
           ORDER BY created_at DESC""",
        (session_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    bots = []
    for row in rows:
        bot_id, bot_name, username, description, status, created_at, steps = row
        bots.append({
            "id": bot_id,
            "bot_name": bot_name,
            "telegram_username": username,
            "telegram_link": f"https://t.me/{username}" if username else None,
            "description": description,
            "status": status,
            "scenario_steps": steps or 0,
            "created_at": created_at.isoformat() if created_at else None,
        })

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"bots": bots}, ensure_ascii=False)
    }
