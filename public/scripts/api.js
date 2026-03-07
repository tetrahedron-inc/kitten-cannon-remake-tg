class Api {
    #baseurl = '/api/v1';
    #auth_token = ''; 
    
    constructor() {
        const url = window.location.href;
        const search_params = url.split('?').filter((e, idx)=>idx!=0).join('?').split('&').map(el=>[el.split('=')[0], el.split('=').filter((e,i)=>i!=0).join('=')]).reduce((prev, curr)=>({...prev, [curr[0]]: curr[1]}), {});
        if(!('tkn' in search_params)) {
            console.log("Hey Hacker :)\nYou're noob.\nThis is really simple game not that secure.");
        } else {
            this.#auth_token = search_params['tkn'];
        }
    }

    async setGameScore(score) {
        const result = await this.#call('setGameScore', {
            score,
        });
        return result;
    }

    async getGameHighScores() {
        const result = await this.#call('getGameHighScores');
        return result;
    }

    async getMyHighScore() {
        const result = await this.#call('getMyHighScore');
        return result;
    }

    async #call(endpoint, payload) {
        const response = await fetch(`${this.#baseurl}/${endpoint}`, {
            method: payload ? 'POST' : 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `PkGamesAuth ${this.#auth_token}`
            },
            body: payload ? JSON.stringify(payload) : null,
        });
        if (response.status != 200) {
            console.error({
                status: response.status,
            });
        }
        return await response.json();
    }

};



const api = new Api();

window.api = api;

export default api;