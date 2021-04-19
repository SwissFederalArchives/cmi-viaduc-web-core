import {Utilities as _util} from '../includes/utilities';

export interface CookieOptionsArgs {
	path?: string;
	domain?: string;
	expires?: string | Date;
	secure?: boolean;
}

export class CookieOptions {
	public path: string;
	public domain: string;
	public expires: string | Date;
	public secure: boolean;

	constructor({path, domain, expires, secure}: CookieOptionsArgs = {}) {
		this.path = !_util.isEmpty(path) ? path : null;
		this.domain = !_util.isEmpty(domain) ? domain : null;
		this.expires = !_util.isEmpty(expires) ? expires : null;
		this.secure = !_util.isEmpty(secure) ? secure : false;
	}

	public merge(options?: CookieOptionsArgs): CookieOptions {
		return new CookieOptions(<CookieOptionsArgs>{
			path: _util.isObject(options) && !_util.isEmpty(options.path) ? options.path : this.path,
			domain: _util.isObject(options) && !_util.isEmpty(options.domain) ? options.domain : this.domain,
			expires: _util.isObject(options) && !_util.isEmpty(options.expires) ? options.expires : this.expires,
			secure: _util.isObject(options) && !_util.isEmpty(options.secure) ? options.secure : this.secure
		});
	}
}
