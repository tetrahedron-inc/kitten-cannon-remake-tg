import { supabase } from "../supabase.mjs";

export default class User{
    static #tableName = 'Users';

    static async getById(id) {
        const result = await supabase.from(this.#tableName)
            .select("*")
            .eq('id', id);
        return result;
    }
};