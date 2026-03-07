import z from "zod";
import e from "express";
import jwt from  "jsonwebtoken";
import { decode_token } from "../../utils/encode_decode_token.mjs";
import env from "../../config/env.mjs";

/**
 * 
 * @param {e.Request} request 
 * @param {e.Response} response 
 * @param {e.NextFunction} next 
 * @returns 
 */

const auth_middleware = async (request, response, next) => {
    // Auth Middleware
    try {
        console.log('[auth_middleware] authorization header: ', request.headers['authorization']);
        const token = decode_token(request.headers['authorization'].split(' ')[1].trim());
        const decoded = jwt.verify(token.tkn, env.JWT_SECRET);
        if(!decoded) {
            console.log('[auth_middleware] decode', decoded);
            return response.status(401).json({
                message: 'You Noob 🤭',
            });
        }

        // validate and parse
        request.data = z.parse(z.object({
            user_id: z.coerce.number(),
            first_name: z.string(),
            username: z.string().optional().default(null),
            inline_message_id: z.string()
        }).or(z.object({
            user_id: z.coerce.number(),
            first_name: z.string(),
            username: z.string().optional().default(null),
            message_id: z.coerce.number(),
            chat: z.object({
                id: z.coerce.number(),
                type: z.enum(['private', 'supergroup', 'group', 'channel']),
                title: z.string().optional(),
            }),
        })), decoded);
        // console.log('request.data: ', request.data);
        next();
    } catch(error) {
        console.log('[auth_middleware] error', error);
        if(error instanceof jwt.JsonWebTokenError) {
            return response.status(401).json({
                message: 'You Noob 🤭',
            });
        }
        next(error);
    }
}


export default auth_middleware;