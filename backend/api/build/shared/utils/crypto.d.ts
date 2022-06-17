export declare const hashPassword: (password: string, saltRounds?: number) => Promise<string | null>;
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
export declare const isStrongPassword: (password: string) => boolean;
