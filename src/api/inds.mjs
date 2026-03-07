import { Router } from "express";
import auth_middleware from "./middleware/auth.middleware.mjs";
import bot from "../services/bot.mjs";

const apiRouter = Router();
apiRouter.use(auth_middleware);


apiRouter.post('/setGameScore', async (request, response) => {
    const data = request.data;
    const body = request.body;
    if(!('score' in body)) {
        return response.status(401).json({
            message: 'You Noob 🤭',
        });
    }

    const score = request.body.score; // parse ?
    let score_response = null;

    if((('chat' in data) && ('message_id' in data))) {
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

    response.json({
        ok: true,
        result: 'ok',
    });
});

apiRouter.get('/getGameHighScores', async (request, response) => {
    const data = request.data;
    let hightscore_response = null;

    if((('chat' in data) && ('message_id' in data))) {
        hightscore_response = await bot.getGameHighScores({
            user_id: data.user_id,
            chat_id: data.chat.id,
            message_id: data.message_id,
        });
    } else if ('inline_message_id' in data) {
        hightscore_response = await bot.getGameHighScores({
            user_id: data.user_id,
            inline_message_id: data.inline_message_id,
        });
    } else {
        return response.status(401).json({
            message: 'You Noob 🤭',
        });
    }

    if(hightscore_response.ok) {
        return response.json({
            ok: true,
            result: hightscore_response.result,
        });
    } else {
        return response.json({
            ok: true,
            result: [],
        });
    }
});

apiRouter.get('/getMyHighScore', async (request, response) => {
    const data = request.data;
    let hightscore_response = null;

    if((('chat' in data) && ('message_id' in data))) {
        hightscore_response = await bot.getGameHighScores({
            user_id: data.user_id,
            chat_id: data.chat.id,
            message_id: data.message_id,
        });
    } else if ('inline_message_id' in data) {
        hightscore_response = await bot.getGameHighScores({
            user_id: data.user_id,
            inline_message_id: data.inline_message_id,
        });
    } else {
        return response.status(401).json({
            message: 'You Noob 🤭',
        });
    }

    if(hightscore_response.ok) {
        const my_res = hightscore_response.result
            // get current_user's highscore
            .filter((game)=> game.user.id === request.data.user_id)
            // only one entry top position?
            .reduce((prev, curr)=>{
                if(prev.length == 0) {
                    return [ curr ];
                } else {
                    if(prev[0].position >= curr.position) {
                        return prev;
                    } else {
                        return [ curr ];
                    }
                }
            },[]);
        return response.json({
            ok: true,
            result: my_res,
        });
    } else {
        return response.json({
            ok: true,
            result: [],
        });
    }
});


export default apiRouter;