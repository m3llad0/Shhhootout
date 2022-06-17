import { Request, Response } from "express";
/**
 * Gets the top n level that have the most amount of downloads in the last week.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const GetTrendingLevels: (req: Request, res: Response) => Promise<void>;
/**
 * Get the statistics for a specified level
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const GetLevelStatistics: (req: Request, res: Response) => Promise<void>;
/**
 * Create a level for a specified user.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const CreateLevel: (req: Request, res: Response) => Promise<void>;
/**
 * Gets a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const GetLevels: (req: Request, res: Response) => Promise<void>;
/**
 * Gets a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const GetLevel: (req: Request, res: Response) => Promise<void>;
/**
 * Updates a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const UpdateLevel: (req: Request, res: Response) => Promise<void>;
/**
 * Deletes a level for a specified id.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const DeleteLevel: (req: Request, res: Response) => Promise<void>;
/**
 * It adds a level to the starred level of a player.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
export declare const InteractLevel: (req: Request, res: Response) => Promise<void>;
