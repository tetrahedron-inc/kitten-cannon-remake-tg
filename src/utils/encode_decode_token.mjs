function randChar() {
    return String.fromCodePoint([Math.floor(Math.random() * 255)]);
}


// function encode(json) {
//     return btoa(
//             btoa(
//                 JSON.stringify(json)
//                 .split("")
//                 .map(char=> String.fromCodePoint([Math.floor(Math.random() * 255)]) + char)
//                 .reduce((prev, curr) => prev + curr, "")
//             )
//             .split("")
//             .map(ch=>String.fromCharCode((ch.codePointAt(0) - 15) % 255))
//             .reduce((prev, curr) => prev + curr, "")
//         )
//         .split("")
//         .reduce((prev, curr, i, str)=>{ 
//             (i < Math.floor(str.length / 2)) ? prev[1]+=curr: prev[0]+=curr; 
//             return prev; },["",""]
//         )
//         .reduce((prev, curr) => prev + curr, "")
//         .split("")
//         .reduce((prev, curr, idx) => ( idx % 2 ?  prev + curr: curr + prev), "");
// }

/**
 * 
 * @param {object} json 
 */
export function encode_token(json) {
    const stringify = JSON.stringify(json).split("").map(char=> randChar() + char).join("");
    return break_mix(btoa(rot_15_encode_left(btoa(stringify))));
}


/**
 * 
 * @param {string} str 
 */
export function decode_token(str) {
    const stringify = atob(rot_15_decode_right(atob(inv_break_mix(str))));
    return JSON.parse(stringify.split("").filter((el,idx)=> (idx % 2 != 0)).join(""));
}


/**
 * 
 * @param {string} str 
 */
function rot_15_encode_left(str) {
    return str.split("").map(ch=>String.fromCharCode((ch.codePointAt(0) - 15) % 255)).join("");
}

/**
 * 
 * @param {string} str 
*/
function rot_15_decode_right(str) {
    return str.split("").map(ch=>String.fromCharCode((ch.codePointAt(0) + 15) % 255)).join("");
}

/**
 * 
 * @param {string} str 
 */
function break_mix(str) {
    const idx = Math.floor(str.length / 2);
    return  mix(str.substring(idx, str.length) + str.substring(0, idx));
}

/**
 * 
 * @param {string} str 
 */
function inv_break_mix(str) {
    const idx = Math.ceil(str.length / 2);
    str = unmix(str);
    return  str.substring(idx, str.length) + str.substring(0, idx);
}

/**
 * 
 * @param {string} str 
 * @returns {string} 
 */
function mix(str) {
    return str.split("").reduce((prev, curr, idx) => {
        if(idx % 2) {
            return prev + curr;
        } else {
            return curr + prev;
        }
    }, "");
}

/**
 * 
 * @param {string} str 
 * @returns {string} 
 */
function unmix(str) {
    return str.split("").reduce((prev, curr, idx, full_str) => {
        const zero_pt = Math.ceil(full_str.length / 2);
        if(idx < zero_pt) {
            return curr + prev;
        } else {
            const ins_pt = (idx - zero_pt) * 2;
            return prev.substring(0, ins_pt + 1) + curr + prev.substring(ins_pt + 1, prev.length); 
        }
    }, "");
}