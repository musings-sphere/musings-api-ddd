import { JWTToken, RefreshToken } from "../../domain/jwt";

export interface LoginDTO {
	userName: string;
	password: string;
}

export interface LoginDTOResponse {
	accessToken: JWTToken;
	refreshToken: RefreshToken;
}
