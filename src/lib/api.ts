import { getSessionId } from "./session";

const REGISTER_BOT = "https://functions.poehali.dev/e7a3b19a-52a6-484b-bd1c-8c4d9cfb65a1";
const GET_BOTS = "https://functions.poehali.dev/24fdc256-d677-4587-a2f8-e1a842fe2bae";

function headers() {
  return {
    "Content-Type": "application/json",
    "X-Session-Id": getSessionId(),
  };
}

export async function registerBot(token: string, description: string) {
  const res = await fetch(REGISTER_BOT, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ token, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  return data as {
    id: number;
    bot_name: string;
    bot_username: string;
    telegram_link: string;
    scenario_steps: number;
    status: string;
  };
}

export async function getBots() {
  const res = await fetch(GET_BOTS, { headers: headers() });
  const data = await res.json();
  return data.bots as Array<{
    id: number;
    bot_name: string;
    telegram_username: string;
    telegram_link: string | null;
    description: string;
    status: string;
    scenario_steps: number;
    created_at: string;
  }>;
}
