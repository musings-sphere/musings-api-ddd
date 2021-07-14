"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = exports.CodeHttp = void 0;
const tslib_1 = require("tslib");
var CodeHttp;
(function (CodeHttp) {
	CodeHttp[(CodeHttp["OK"] = 200)] = "OK";
	CodeHttp[(CodeHttp["CREATED"] = 201)] = "CREATED";
	CodeHttp[(CodeHttp["BAD_REQUEST"] = 400)] = "BAD_REQUEST";
	CodeHttp[(CodeHttp["UNAUTHORIZED"] = 401)] = "UNAUTHORIZED";
	CodeHttp[(CodeHttp["FORBIDDEN"] = 403)] = "FORBIDDEN";
	CodeHttp[(CodeHttp["NOT_FOUND"] = 404)] = "NOT_FOUND";
	CodeHttp[(CodeHttp["CONFLICT"] = 409)] = "CONFLICT";
	CodeHttp[(CodeHttp["SERVER_ERROR"] = 500)] = "SERVER_ERROR";
})((CodeHttp = exports.CodeHttp || (exports.CodeHttp = {})));
class BaseController {
	static jsonResponse(res, code, message) {
		return res.status(code).json({ message });
	}
	execute(req, res) {
		return tslib_1.__awaiter(this, void 0, void 0, function* () {
			try {
				yield this.executeImpl(req, res);
			} catch (err) {
				this.fail(res, "An unexpected error occurred");
			}
		});
	}
	ok(res, dto, created) {
		const codeHttp = created || CodeHttp.OK;
		if (dto) {
			res.type("application/json");
			return res.status(codeHttp).json(dto);
		} else {
			return res.sendStatus(codeHttp);
		}
	}
	badRequest(res, message) {
		return BaseController.jsonResponse(
			res,
			CodeHttp.BAD_REQUEST,
			message ? message : "Bad request",
		);
	}
	unauthorized(res, message) {
		return BaseController.jsonResponse(
			res,
			CodeHttp.UNAUTHORIZED,
			message ? message : "Unauthorized",
		);
	}
	notFound(res, message) {
		return BaseController.jsonResponse(
			res,
			CodeHttp.NOT_FOUND,
			message ? message : "Not found",
		);
	}
	conflict(res, message) {
		return BaseController.jsonResponse(
			res,
			CodeHttp.CONFLICT,
			message ? message : "Conflict",
		);
	}
	fail(res, error) {
		return res.status(CodeHttp.SERVER_ERROR).json({
			message: error.toString(),
		});
	}
}
exports.BaseController = BaseController;
//# sourceMappingURL=baseController.js.map
