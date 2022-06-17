import { Request, Response } from "express";
/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const CreateScore: (req: Request, res: Response) => Promise<void>;
/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const CreateSession: (req: Request, res: Response) => Promise<void>;
/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const UpdateSession: (req: Request, res: Response) => Promise<void>;
