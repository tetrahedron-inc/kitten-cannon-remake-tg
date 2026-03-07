import env from "../config/env.mjs";
import Bot from "./bot/Bot.mjs";

/**@type {Bot} */
const bot = new Bot(env.BOT_TOKEN);

export default bot;