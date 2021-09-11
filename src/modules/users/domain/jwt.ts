export interface JWTClaims {
	userId: string;
	isEmailVerified: boolean;
	email: string;
	userName: string;
	adminUser: boolean;
}

export type JWTToken = string;

export type SessionId = string;

export type RefreshToken = string;
