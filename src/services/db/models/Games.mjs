import { supabase } from "../supabase.mjs";

/**
 * @typedef {'kitten_cannon'} AllGameNames 
 * 
 */

export default class Games {
    static #tableName = 'Games';
    
    static #cache = {};
    /**
     * @param {AllGameNames} game_short_name 
     * @returns {Promise<{
     *  id: number;
     *  game_short_name: AllGameNames;
     * }>}
     */
    static async getFromShortName(game_short_name) {
        const result = await supabase.from(this.#tableName)
            .select("*")
            .eq('game_short_name', game_short_name)
            .limit(1);
        
        this.#cache[game_short_name] = result.data.map(data=>({
            id: data.id,
            game_short_name: data.game_short_name,
        }))[0];

        if(result.error) {
            console.error(`ERROR:: Games::getFromShortName('${game_short_name}') `, result.error);
        }

        return this.#cache[game_short_name];
    }


    /**
     * @param {AllGameNames} game_short_name 
     * @returns {Promise<{
     *  id: number;
     *  game_short_name: AllGameNames;
     * }>}
     */
    static async getFromShortName_Cached(game_short_name) {
        if(game_short_name in this.#cache) {
            return this.#cache[game_short_name];
        }
        return this.getFromShortName(game_short_name);
    }
};