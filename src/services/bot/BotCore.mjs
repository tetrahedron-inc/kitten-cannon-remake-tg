export default class BotCore {

    /** @type{string | null} */
    #bot_token = null;

    /**
     * 
     * @param {string} token 
     */
    constructor(token) {
        this.#bot_token = token;
    }

    /**
     * 
     * @param {string} endpoint 
     * @param {any} body
     */
    async callApi(endpoint='getMe', body = {}) {
        const res = await fetch(
            `https://api.telegram.org/bot${this.#bot_token}/${endpoint}`
            , {
                method:'POST',
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify(body),
            }
        );
        return await res.json();
    }
}