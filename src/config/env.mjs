import { config } from "dotenv";
import z from "zod";

config();

const env = z.parse(z.object({
    HTTP_PORT: z.coerce.number(),
    JWT_SECRET: z.string(),
    BOT_TOKEN: z.string(),
}), process.env);


export default env;