export interface JWTData {
    user_id: string;
}
export declare const generateAccessToken: (data: JWTData) => any;
export declare const authenticated: () => typeof authenticateToken;
declare function authenticateToken(req: any, res: any, next: any): any;
export {};
