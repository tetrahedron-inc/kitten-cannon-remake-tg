import { supabase } from "../supabase.mjs";

/**
 * @typedef {{
 *  score: number;
 *  timestamp: number;
 * }} HighScoreHistoryEntry
 */

export default class GamesUsersHighscore {
    static #tableName = 'GamesUsersHighscore';
    static #tail_history_size = 6;

    /**
     * 
     * @param {number} game_id 
     * @param {number} user_id 
     * @param {number} score 
     * 
     * @returns {Promise<boolean>}
     */
    static async setScore(game_id, user_id, score) {
        const { highscore, highscore_history, num_plays } = await this.getScores(game_id, user_id);
        if(score < highscore) {
            try {
                await supabase.from(this.#tableName).update({
                    num_plays: num_plays + 1,
                })
                .eq('user_id', user_id)
                .eq('game_id', game_id);
            } catch(err) {
                console.error(`ERROR: GamesUsersHighscore::setScore(${game_id}, ${user_id}, ${score})`, err);
            }
            return true;
        }
        const new_highscore = Math.max(highscore, score);
        const new_highscore_history = [...highscore_history, {score, timestamp: Date.now()}].sort((entry1, entry2)=>(entry2.score - entry1.score)).filter((el, idx) => (idx < this.#tail_history_size));
        const updated = await supabase.from(this.#tableName).update({
            highscore: new_highscore,
            highscore_history: new_highscore_history,
            num_plays: num_plays + 1,
        })
        .eq('user_id', user_id)
        .eq('game_id', game_id);

        if(updated.error) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {number} game_id
     * @param {number} user_id
     * 
     * @returns {Promise<{
     *  highscore: number;
     *  highscore_history: Array<HighScoreHistoryEntry>;
     *  num_plays: number;
     * }>}
     */
    static async getScores(game_id, user_id) {
        const response = await supabase.from(this.#tableName)
            .select("highscore, highscore_history, num_plays")
            .eq('game_id', game_id)
            .eq('user_id', user_id)
            .limit(1);

        if(!response.data || response.data.length == 0) {
            await this.#initializeUserEntry(game_id, user_id);
            return {
                highscore: 0,
                highscore_history: [],
                num_plays: 1,
            };
        }
        return response.data[0];
    }

    /**
     * 
     * @param {number} game_id
     * @param {number} user_id
     */
    static async #initializeUserEntry(game_id, user_id) {
        try {
            await supabase
                .from(this.#tableName)
                .insert({game_id, user_id, highscore: 0, highscore_history: []});
        } catch(err) {
            console.error(`ERROR: GamesUsersHighscore::#initializeUserEntry(${game_id}, ${user_id})`, err);
        }
    }

    /**
     * 
     * @param {number} game_id - which game 
     * @param {number} top_k - how many top players to fetch 
     * 
     * @returns {Promise<Array<{
     *  user_id: number;
     *  first_name: string;
     *  username: string | null;
     *  score: number;
     * }>>}
     */
    static async getTopScores(game_id, top_k = 10) {
        const result = await supabase.from(this.#tableName)
            .select("highscore, Users(id, first_name, username)")
            .eq('game_id', game_id)
            .order('highscore', {
                ascending: false,
            })
            .limit(top_k);
        
        if(!result.data) {
            return [];
        }

        return result.data.map(entry=>({
            user_id: entry.Users.id, 
            first_name: entry.Users.first_name,
            username: entry.Users.username, 
            score: entry.highscore,
        }));
    }
    
};