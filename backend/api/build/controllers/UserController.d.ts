import { Request, Response } from "express";
/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const RegisterUser: (req: Request, res: Response) => Promise<void>;
/**
 * Tries to login a verified user with its credentials, and returns a jwt token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const LoginUser: (req: Request, res: Response) => Promise<void>;
/**
 * Get the user statistics of a player.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const GetUserStatistics: (req: Request, res: Response) => Promise<void>;
