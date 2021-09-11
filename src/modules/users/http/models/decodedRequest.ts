import { Request } from "express";
import { JWTClaims } from "../../domain/jwt";

export interface DecodedExpressRequest extends Request {
	decoded: JWTClaims;
}
