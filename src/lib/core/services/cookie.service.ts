import {Injectable, Optional} from '@angular/core';
import {CookieOptions, CookieOptionsArgs} from '../model/cookie';
import {Utilities as _util} from '../includes/utilities';

export interface ICookieService {
	get(key: string): string;

	getObject(key: string): unknown;

	getAll(): unknown;

	put(key: string, value: string, options?: CookieOptionsArgs): void;

	putObject(key: string, value: unknown, options?: CookieOptionsArgs): void;

	remove(key: string, options?: CookieOptionsArgs): void;

	removeAll(): void;
}

@Injectable()
export class CookieService implements ICookieService {
	protected get cookieString(): string {
		return document.cookie || '';
	}

	protected set cookieString(val: string) {
		document.cookie = val;
	}

	constructor(@Optional() private _defaultOptions?: CookieOptions) {
	}

	public get(key: string): string {
		return (<any>this._cookieReader())[key];
	}

	public getObject(key: string): unknown {
		const value = this.get(key);
		return value ? JSON.parse(value) : value;
	}

	public getAll(): unknown {
		return <any>this._cookieReader();
	}

	public put(key: string, value: string, options?: CookieOptionsArgs) {
		this._cookieWriter(key, value, options);
	}

	public putObject(key: string, value: unknown, options?: CookieOptionsArgs) {
		this.put(key, JSON.stringify(value), options);
	}

	public remove(key: string, options?: CookieOptionsArgs): void {
		this._cookieWriter(key, undefined, options);
	}

	public removeAll(): void {
		const cookies = this.getAll();
		Object.keys(cookies).forEach(key => {
			this.remove(key);
		});
	}

	private _cookieReader(): unknown {
		let lastCookies = {};
		let lastCookieString = '';

		let cookieArray: string[], cookie: string, i: number, index: number, name: string;
		const currentCookieString = this.cookieString;
		if (currentCookieString !== lastCookieString) {
			lastCookieString = currentCookieString;
			cookieArray = lastCookieString.split('; ');
			lastCookies = {};
			for (i = 0; i < cookieArray.length; i++) {
				cookie = cookieArray[i];
				index = cookie.indexOf('=');
				if (index > 0) {  // ignore nameless cookies
					name = this._safeDecodeURIComponent(cookie.substring(0, index));
					// the first value that is seen for a cookie is the most
					// specific one.  values for the same cookie name that
					// follow are for less specific paths.
					if (_util.isEmpty((<any>lastCookies)[name])) {
						(<any>lastCookies)[name] = this._safeDecodeURIComponent(cookie.substring(index + 1));
					}
				}
			}
		}
		return lastCookies;
	}

	private _cookieWriter(name: string, value: string, options: CookieOptionsArgs) {
		document.cookie = this._buildCookieString(name, value, options);
	}

	private _safeDecodeURIComponent(str: string) {
		try {
			return decodeURIComponent(str);
		} catch (e) {
			return str;
		}
	}

	private _buildCookieString(name: string, value: string, options: CookieOptionsArgs): string {
		const cookiePath = '/';
		let expires: any;
		const defaultOpts = this._defaultOptions || new CookieOptions(<CookieOptionsArgs>{path: cookiePath});
		const opts: CookieOptions = this._mergeOptions(defaultOpts, options);
		expires = opts.expires;
		if (_util.isEmpty(value)) {
			expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
			value = '';
		}
		if (_util.isString(expires)) {
			expires = new Date(expires);
		}

		let str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		str += opts.path ? ';path=' + opts.path : '';
		str += opts.domain ? ';domain=' + opts.domain : '';
		str += expires ? ';expires=' + expires.toUTCString() : '';
		str += opts.secure ? ';secure' : '';

		// per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
		// - 300 cookies
		// - 20 cookies per unique domain
		// - 4096 bytes per cookie
		const cookieLength = str.length + 1;
		if (cookieLength > 4096) {
			// eslint-disable-next-line
			console.warn(`Cookie \'${name}\' possibly not set or overflowed because it was too large (${cookieLength} > 4096 bytes)!`);
		}
		return str;
	}

	private _mergeOptions(defaultOpts: CookieOptions, providedOpts?: CookieOptionsArgs): CookieOptions {
		const newOpts = defaultOpts;
		if (_util.isDefined(providedOpts)) {
			return newOpts.merge(new CookieOptions(providedOpts));
		}
		return newOpts;
	}

}
