import { Router } from "express";
import auth_middleware from "./middleware/auth.middleware.mjs";
import bot from "../services/bot.mjs";
import Games from "../services/db/models/Games.mjs";
import GamesUsersHighscore from "../services/db/models/GamesUsersHighscore.mjs";
import constants from "../config/constants.mjs";
import z from "zod";

const apiRouter = Router();
apiRouter.use(auth_middleware);

// NOTE: backend apis are done now only need to handle frontend.

apiRouter.post('/setGameScore', async (request, response) => {
    const { id: game_id } = await Games.getFromShortName_Cached(constants.game_short_name);
    const data = request.data;
    const body = request.body;
    if (!('score' in body)) {
        return response.status(401).json({
            message: 'You Noob 🤭',
        });
    }

    const score = z.parse(z.coerce.number(), request.body.score);
    let score_response = null;

    if ((('chat' in data) && ('message_id' in data))) {
        score_response = await bot.setGameScore({
            score,
            user_id: data.user_id,
            chat_id: data.chat.id,
            message_id: data.message_id,
        });
    } else if ('inline_message_id' in data) {
        score_response = await bot.setGameScore({
            score,
            user_id: data.user_id,
            inline_message_id: data.inline_message_id,
        });
    } else {
        return response.status(401).json({
            message: 'You Noob 🤭',
        });
    }
    if(score_response.ok) {
        // insert into db (atomicity :D rip), 
        // we might be out of sync if db fails.
        // TODO: do db first ? and commit after tg success.
        if(!(await GamesUsersHighscore.setScore(game_id, data.user_id, score))) {
            console.error(`[POST /setGameScore] Failed GamesUsersHighscore.setScore(${game_id}, ${data.user_id}, ${score})`)
        }
    }
    response.json({
        ok: true,
        result: 'ok',
    });
});

// get globally top players and their scores.
apiRouter.get('/getGameHighScores', async (request, response) => {
    const { id: game_id } = await Games.getFromShortName_Cached(constants.game_short_name);
    const toppers = await GamesUsersHighscore.getTopScores(game_id, 8);
    response.json(toppers);
});

// When we initially call this method.
// apart from fetching user game score it also sets score in current chat / game
// fetching from database, so all games have same score regardless of where they play.
apiRouter.get('/getMyHighScore', async (request, response) => {
    const data = request.data;
    const user_id = data.user_id;
    const { id: game_id } = await Games.getFromShortName_Cached(constants.game_short_name);
    const score = await GamesUsersHighscore.getScores(game_id, user_id); // Global score.

    // set this highscore with th bot.
    // Sync global score to this chat.
    if ((('chat' in data) && ('message_id' in data))) {
        await bot.setGameScore({
            score: score.highscore,
            user_id: data.user_id,
            chat_id: data.chat.id,
            message_id: data.message_id,
        });
    } else if ('inline_message_id' in data) {
        await bot.setGameScore({
            score: score.highscore,
            user_id: data.user_id,
            inline_message_id: data.inline_message_id,
        });
    } else {
        return response.status(401).json({
            message: 'You Noob 🤭',
        });
    }

    // send global score.
    response.json({
        highscore: score.highscore,
    })
});


export default apiRouter;