import { Vector2D } from "../../../Lib/Math/Vector2D.js";
import Button from "../Button.js";

export default class LeaderboardScreen {

    constructor(canvas2D_context, screens_sprite, button_font_family, leaderboard) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = screens_sprite;
        this.__button_font_family = button_font_family;

        /** @type {Array<{user_id: number;first_name: string; username: string | null; score: number;}>} */
        this.__leaderboard = leaderboard;

        this.__frame = screens_sprite.getFrame("leaderboard_screen.png");
        this.onBackClick = () => { };
        this.buttons = {};
        this.visible = true;
        this.__create_buttons();
    }
    __create_buttons() {
        let canvas_w_half = this.__ctx.canvas.width / 2;
        let canvas_h = this.__ctx.canvas.height;

        this.__leaderboard = this.__leaderboard.sort((lb1, lb2) => (lb2.score - lb1.score));
        const font_size = 70;
        this.__ctx.font = font_size + "px " + this.__button_font_family;
        { // Start button
            let text = "Back";
            let font_width = this.__ctx.measureText(text).width / 2; // why?
            let position = new Vector2D(canvas_w_half - font_width / 2, canvas_h - 80);

            this.buttons["back"] = new Button(this.__ctx, text, position, 60, "#000", this.__button_font_family);
            this.buttons["back"].onClick = () => {
                this.onBackClick();
            }
        }
    }
    updateClickInput(cursor_position_vec) {
        if (!this.visible) return;
        if (!(cursor_position_vec instanceof Vector2D)) throw Error(" Cursor position should be a vector2D .");
        for (let button_key in this.buttons) {
            this.buttons[button_key].updateClickInput(cursor_position_vec);
        }
    }


    draw_leaderboard() {
        this.__ctx.font = `40px `+this.__button_font_family;
        this.__ctx.fillText("Global Leaderboard", 450, 180);
        
        const font_size = 20;
        this.__ctx.font = `${font_size}px monospace,"Courier New", Courier`;

        for(let idx = 0; idx < this.__leaderboard.length; idx++) {
            const username = this.__leaderboard[idx].username ? ('@' + this.__leaderboard[idx].username) :  "------------";
            const firstname = this.__leaderboard[idx].first_name;
            const score = this.__leaderboard[idx].score;
            this.__ctx.fillText(`🧨 ${idx + 1} `, 140, 250 + (font_size + 20) * idx);
            this.__ctx.fillText(firstname, 200, 250 + (font_size + 20) * idx, 480 - 200 - 6);
            this.__ctx.fillText(username, 480, 250 + (font_size + 20) * idx, 800 - 480 - 6);
            this.__ctx.fillText(score, 800, 250 + (font_size + 20) * idx );
        }
    }


    draw() {

        if (!this.visible) return;

        this.__frame.draw(this.__ctx, 0, 0, this.__ctx.canvas.width, this.__ctx.canvas.height);
        
        this.draw_leaderboard();

        for (let key in this.buttons) {
            this.buttons[key].draw();
        }

    }
}