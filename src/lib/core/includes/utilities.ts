const defaultIdentifierToBlankRegex = /([:,;\-\/\?\!<>\\\*\|()\[\]{}"\x00-\x1f\x80-\x9f]|\.+)/g;
const defaultIdentifierCleanupRegex = /[ ]/g;
const condenseMultipleDelimiterRegex = /(\-{2,3})/g;

const diacriticsReplacements = [];
(function () {
	let repl = '', base = '', i;

	repl += 'É|Ê|Ë|š|Ì|Í|ƒ|œ|µ|Î|Ï|ž|Ð|Ÿ|Ñ|Ò|Ó|Ô|Š|£|Õ|Ö |Œ|¥|Ø|Ž|§|À|Ù|Á|Ú|Â|Û|Ã|Ü |Ä |Ý|';
	base += 'E|E|E|s|I|I|f|o|m|I|I|z|D|Y|N|O|O|O|S|L|O|OE|O|Y|O|Z|S|A|U|A|U|A|U|A|UE|AE|Y|';

	repl += 'Å|Æ|ß|Ç|à|È|á|â|û|Ĕ|ĭ|ņ|ş|Ÿ|ã|ü |ĕ|Į|Ň|Š|Ź|ä |ý|Ė|į|ň|š|ź|å|þ|ė|İ|ŉ|Ţ|Ż|æ|ÿ|';
	base += 'A|A|S|C|a|E|a|a|u|E|i|n|s|Y|a|ue|e|I|N|S|Z|ae|y|E|i|n|s|z|a|p|e|I|n|T|Z|a|y|';

	repl += 'Ę|ı|Ŋ|ţ|ż|ç|Ā|ę|Ĳ|ŋ|Ť|Ž|è|ā|Ě|ĳ|Ō|ť|ž|é|Ă|ě|Ĵ|ō|Ŧ|ſ|ê|ă|Ĝ|ĵ|Ŏ|ŧ|ë|Ą|ĝ|Ķ|ŏ|';
	base += 'E|l|n|t|z|c|A|e|I|n|T|Z|e|a|E|i|O|t|z|e|A|e|J|o|T|i|e|a|G|j|O|t|e|A|g|K|o|';

	repl += 'Ũ|ì|ą|Ğ|ķ|Ő|ũ|í|Ć|ğ|ĸ|ő|Ū|î|ć|Ġ|Ĺ|Œ|ū|ï|Ĉ|ġ|ĺ|œ|Ŭ|ð|ĉ|Ģ|Ļ|Ŕ|ŭ|ñ|Ċ|ģ|ļ|ŕ|Ů|';
	base += 'U|i|a|G|k|O|u|i|C|g|k|o|U|i|c|G|L|O|u|i|C|g|l|o|U|o|c|G|L|R|u|n|C|g|l|r|U|';

	repl += 'ò|ċ|Ĥ|Ľ|Ŗ|ů|ó|Č|ĥ|ľ|ŗ|Ű|ô|č|Ħ|Ŀ|Ř|ű|õ|Ď|ħ|ŀ|ř|Ų|ö |ď|Ĩ|Ł|Ś|ų|Đ|ĩ|ł|ś|Ŵ|ø|đ|';
	base += 'o|c|H|L|R|u|o|C|h|l|r|U|o|c|H|L|R|u|o|D|h|l|r|U|oe|d|I|L|S|c|D|i|l|s|W|o|d|';

	repl += 'Ī|Ń|Ŝ|ŵ|ù|Ē|ī|ń|ŝ|Ŷ|Ə|ú|ē|Ĭ|Ņ|Ş|ŷ';
	base += 'I|N|S|w|u|E|i|n|s|Y|e|u|e|I|N|S|y';

	let rs = repl.split('|');
	let bs = base.split('|');

	for (i = 0; i < rs.length; i++) {
		diacriticsReplacements.push({
			base: bs[i],
			repl: new RegExp('[' + rs[i].trim() + ']', 'g')
		});
	}
})();

const naturalCompareGroups = /(-?\d*\.?\d+)/g;
// @dynamic
export class Utilities {

	// region Any functions

	public static isString(o: any): boolean {
		return (typeof o === 'string');
	}

	public static isNumber(o: any): boolean {
		return (typeof o === 'number');
	}

	public static isBoolean(o: any): boolean {
		return (typeof o === 'boolean') || (typeof o === 'object' && typeof o.valueOf() === 'boolean');
	}

	public static isArray(o: any): boolean {
		return (Array.isArray(o));
	}

	public static isObject(o: any): boolean {
		return (typeof o === 'object');
	}

	public static isDate(o: any): boolean {
		return this.isObject(o) && Object.prototype.toString.call(o) === '[object Date]';
	}

	public static isRegExp(o: any): boolean {
		return this.isObject(o) && Object.prototype.toString.call(o) === '[object RegExp]';
	}

	public static isFunction(o: any): boolean {
		return (typeof o === 'function');
	}

	public static isUndefined(o: any): boolean {
		return !o || typeof o === 'undefined';
	}

	public static isDefined(o: any): boolean {
		return o && typeof o !== 'undefined';
	}

	public static isEmpty(o: any): boolean {
		if (this.isUndefined(o)) {
			return true;
		}
		if (this.isArray(o)) {
			return o.length === 0;
		}
		if (this.isString(o)) {
			return o.length === 0 || o.match(/^ *$/) !== null;
		}
		if (this.isObject(o)) {
			return (o['length'] === 0) || (Object.keys(o).length === 0);
		}
		return false;
	}

	public static clone(obj: any): any {
		if (Utilities.isArray(obj)) {
			let arr = [];
			obj.forEach((x) => {
				arr.push(Utilities.clone(x));
			});
			return arr;
		} else {
			return Object.keys(obj).reduce(function (newObj, key) {
				let val = obj[key];
				let newVal = (typeof val === 'object' && val) ? Utilities.clone(val) : val;
				newObj[key] = newVal;
				return newObj;
			}, {});
		}
	}

	public static cloneWithLowerCasedKeys(obj: any): any {
		return Object.keys(obj).reduce(function (newObj, key) {
			let val = obj[key];
			let newVal = (typeof val === 'object') ? Utilities.cloneWithLowerCasedKeys(val) : val;
			newObj[key.toLowerCase()] = newVal;
			return newObj;
		}, {});
	}

	public static forEach(obj: any, fn: any) {
		if (Utilities.isArray(obj)) {
			obj.forEach(fn);
		} else {
			return Object.keys(obj).map(function (key) {
				fn(obj[key], key);
			});
		}
	}

	public static remove(obj: any[], fn: any): void {
		if (Utilities.isArray(obj)) {
			let i = 0;
			while (i < obj.length) {
				if (fn(obj[i])) {
					obj.splice(i, 1);
				} else {
					i += 1;
				}
			}
		} else {
			throw new Error('Not implemented');
		}

	}

	// endregion

	// region String functions

	public static startsWith(s: string, t: string): boolean {
		return (this.isString(s) && this.isString(t) && s.indexOf(t) === 0);
	}

	public static endsWith(s: string, t: string): boolean {
		return (this.isString(s) && this.isString(t) && s.length >= t.length && s.lastIndexOf(t) === s.length - t.length);
	}

	public static trim(s: string, c?: string): string {
		c = c || '\\s';
		let l = new RegExp('^' + c + '+', '');
		let r = new RegExp(c + '+$', '');
		return s.replace(l, '').replace(r, '');
	}

	public static reverse(o: any): any {
		if (this.isString(o)) {
			return o.split('').reverse().join('');
		} else if (this.isArray(o)) {
			return o.slice().reverse();
		} else {
			return o;
		}
	}

	public static addToString(s: string, ...args: any[]): string {
		let i = 0, d = null, t = null;
		while (i < args.length) {
			d = args[i];
			t = args[i + 1];
			if (this.isEmpty(s)) {
				s = t;
			} else if (!this.isEmpty(t)) {
				if (this.isEmpty(d)) {
					s = s + t;
				} else {
					if (this.startsWith(t, d)) {
						t = t.substring(d.length, t.length);
					}
					if (this.endsWith(s, d)) {
						d = '';
					}
					s = s + d + t;
				}
			}
			i += 2;
		}
		return s;
	}

	public static intToString(i: number, l: number) {
		let s = '' + i;
		while (s.length < l) {
			s = '0' + s;
		}
		return s;
	}

	public static naturalCompare(a: any, b: any, key: string): number {
		let as = this.isString(a) ? a : a[key],
			bs = this.isString(b) ? b : b[key],
			aa = String(as).split(naturalCompareGroups),
			bb = String(bs).split(naturalCompareGroups),
			min = Math.min(aa.length, bb.length);

		for (let i = 0; i < min; i++) {
			let av = parseFloat(aa[i]) || aa[i].toLowerCase(),
				bv = parseFloat(bb[i]) || bb[i].toLowerCase();
			if (av < bv) {
				return -1;
			} else if (av > bv) {
				return 1;
			}
		}

		return 0;
	}

	public static format(/*input,value0,value1,...]*/) {
		let args = arguments, input = args[0], reSeq = 0;
		return input.replace(/\{(\d+)\}/g, function (match, capture) {
			let seq = (1 * capture + 1);
			return (seq < args.length) ? args[seq] : '{' + (reSeq++) + '}';
		});
	}

	public static formatByKey(input: string, values: any) { /* values: keyValueCollection */
		return input.replace(/\{(\w+)\}/g, function (match, capture) {
			return !this.isUndefined(values[capture]) ? values[capture] : '{' + capture + '}';
		});
	}

	public static toLowerCamelCase(s: string): string {
		if (this.isString(s) && s.length > 0) {
			s = s.length > 1 ? s.substring(0, 1).toLowerCase() + s.substring(1) : s.toLowerCase();
		}
		return s;
	}

	public static replaceDiacritics(s: string, replacements?: any): string {
		let repl = replacements || diacriticsReplacements,
			i = 0;

		for (i = 0; i < repl.length; i += 1) {
			let r = repl[i];
			s = s.replace(r.repl, r.base);
		}

		return s;
	}

	public static toIdentifier(s: string, lowerCase = false): string {
		if (this.isString(s)) {
			s = this.replaceDiacritics(s);
			s = s.replace(defaultIdentifierToBlankRegex, '_');
			s = s.replace(defaultIdentifierCleanupRegex, '');
			if (lowerCase === true) {
				s = s.toLowerCase();
			}
		}
		return s;
	}

	public static toUrlComponent(s: string, lowerCase = false): string {
		if (this.isString(s)) {
			s = this.replaceDiacritics(s);
			s = s.replace(defaultIdentifierToBlankRegex, '-');
			s = s.replace(defaultIdentifierCleanupRegex, '-');
			s = s.replace(condenseMultipleDelimiterRegex, '-');
			s = this.trim(s, '-');
			if (lowerCase === true) {
				s = s.toLowerCase();
			}
		}
		return s;
	}

	public static isHtmlMarkup(s: string): boolean {
		return (this.isString(s) && (s.indexOf('</') >= 0 || s.indexOf('/>') > 0));
	}

	public static isAngularMarkup(s: string): boolean {
		return this.isHtmlMarkup(s) && ((s.indexOf('}}') >= 0) || s.indexOf('</ng-') >= 0 || s.indexOf('</cmi-') >= 0);
	}

	// endregion

	// region JSON functions

	private static toJsonReplacer(key: string, value: any): any {
		let val = value;

		if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
			val = undefined;
		} else if (value && value.document) {
			val = '$WINDOW';
		} else if (value && window.document === value) {
			val = '$DOCUMENT';
		}

		return val;
	}

	public static toJson(obj: any, pretty?: any) {
		if (this.isUndefined(obj)) {
			return undefined;
		}
		if (!this.isNumber(pretty)) {
			pretty = pretty ? 2 : null;
		}
		return JSON.stringify(obj, this.toJsonReplacer, pretty);
	}

	public static decycleJson(object: any, replacer?: any): any {
		// see https://github.com/douglascrockford/JSON-js/blob/master/cycle.js

		let objects = new WeakMap();

		return (function derez(value, path) {
			let oldPath;
			let nu;
			if (replacer !== undefined) {
				value = replacer(value);
			}
			if (
				typeof value === 'object' && value !== null &&
				!(value instanceof Boolean) &&
				!(value instanceof Date) &&
				!(value instanceof Number) &&
				!(value instanceof RegExp) &&
				!(value instanceof String)) {
				oldPath = objects.get(value);
				if (oldPath !== undefined) {
					return {$ref: oldPath};
				}
				objects.set(value, path);
				if (Array.isArray(value)) {
					nu = [];
					value.forEach(function (element, i) {
						nu[i] = derez(element, path + '[' + i + ']');
					});
				} else {
					// If it is an object, replicate the object.
					nu = {};
					Object.keys(value).forEach(function (name) {
						nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
					});
				}
				return nu;
			}
			return value;
		}(object, '$'));
	}

	// endregion

	// region Jq functions

	public static initJQForElement(elem: any, services?: any): void {
		if (window && window['cmi'] && window['cmi']['initJQForElement']) {
			window['cmi']['initJQForElement'](elem, services);
		}
	}

	// endregion

	// region Browser

	public static getQueryParams(query: string = null): any {
		let params = {};
		let qs = this.isEmpty(query) ? window.location.search : query;
		if (this.isEmpty(qs)) {
			return params;
		}
		const ps = qs.split('?');
		qs = ps[ps.length - 1];
		const parts = qs.split('&');
		parts.forEach((part) => {
			const p = part.split('=');
			params[p[0]] = (p.length > 1) ? decodeURIComponent(p[1]) : undefined;
		});
		return params;
	}

	public static appendQueryParam(query, param): string {
		return this.addToString(query, '&', param);
	}

	public static appendUrlParam(url, param): string {
		return this.addToString(url, (url.indexOf('?') < 0) ? '?' : '&', param);
	}

	// endregion
}
