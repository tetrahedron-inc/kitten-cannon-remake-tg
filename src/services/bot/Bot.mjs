import BotCore from "./BotCore.mjs";

class Bot extends BotCore {
    /**
     * 
     * @param {string} token 
     */
    constructor(token) {
        super(token);
    }

    /**
     * 
     * @param {{
     *  user_id: number;
     *  score: number;
     *  force: boolean;
     *  disable_edit_message: boolean;
     * } & ({
     *  inline_message_id: string;
     * } | {
     *  chat_id: number;
     *  message_id: number;
     * })} param0
     * @returns 
     */
    async setGameScore({inline_message_id, user_id, score, force, disable_edit_message, chat_id, message_id}) {
        return await this.callApi('setGameScore', {
            user_id,
            chat_id,
            message_id,
            inline_message_id,
            score,
            force,
            disable_edit_message,
        });
    }

    /**
     * 
     * @param {{
     *  user_id: number;
     * } & ({
     *  inline_message_id: string;
     * } | {
     *  chat_id: number;
     *  message_id: number;
     * })} param0 
     * @returns 
     */
    async getGameHighScores({inline_message_id, user_id, chat_id, message_id}) {
        return await this.callApi('getGameHighScores', {
            user_id,
            chat_id,
            message_id,
            inline_message_id,
        });
    }
}


export default Bot;