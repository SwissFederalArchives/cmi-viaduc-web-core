import {Routes} from '@angular/router';
import {Utilities as _util} from '../../includes';
// @dynamic
export class Routing {

	public static readonly supportedLanguages: string[] = ['de', 'fr', 'it', 'en'];

	public static readonly defaultLanguage = 'de';
	public static get languageMatcher() { return /^(de|fr|it|en)/; }
	public static get languagePrefixMatcher() { return /^\/(de|fr|it|en)/; }
	public static readonly languagePrefixLength = 3;

	public static localizations = {};
	public static normalizations = {};

	private static assertPath(path: string): string {
		if (_util.isEmpty(path)) {
			return path;
		}
		const parts = path.toLowerCase().split('/');
		for (let i = 0; i < parts.length; i += 1) {
			const p = parts[i];
			if (p.indexOf(':') < 0) {
				parts[i] = _util.toUrlComponent(p, true);
			}
		}
		return parts.join('/');
	}

	public static assertRoutes(routes: Routes, options: any, depth = 0): void {
		for (let i = 0; i < routes.length; i += 1) {
			const route = routes[i];
			if (_util.isFunction(options.assertRoute)) {
				options.assertRoute(route);
			}

			if (!_util.isEmpty(route['path'])) {
				route.path = this.assertPath(route.path);
			}
			if (!_util.isEmpty(route['redirectTo'])) {
				route.redirectTo = this.assertPath(route.redirectTo);
			}
			if (_util.isArray(route['children'])) {
				this.assertRoutes(route.children, options, depth + 1);
			}
		}
	}

	private static addLocalizations(dictionary: any, keys: string, values: string): void {
		if (_util.isEmpty(keys) || _util.isEmpty(values)) {
			return;
		}
		const ks = keys.split('/');
		const vs = values.split('/');

		for (let i = 0; i < ks.length && i < vs.length; i += 1) {
			const k = ks[i];
			const v = vs[i];
			if (!_util.isEmpty(k) && k.indexOf(':') < 0) {
				dictionary[k] = v;
			}
		}
	}

	private static collectLanguageLocalizations(language: string, routes: Routes, depth = 0): void {
		const localizations = this.localizations[language] = (this.localizations[language] || {});
		const normalizations = this.normalizations[language] = (this.normalizations[language] || {});
		for (let i = 0; i < routes.length; i += 1) {
			const route = routes[i];
			if (!_util.isEmpty(route.path)) {
				const path = this.assertPath(route.path);
				const localized = this.assertPath((route['_localize'] || {})[language]) || path;
				this.addLocalizations(localizations, path, localized);
				this.addLocalizations(normalizations, localized, path);
				if (_util.isArray(route['children'])) {
					this.collectLanguageLocalizations(language, route.children, depth + 1);
				}
			}
		}
	}

	public static collectLocalizations(languages: string[], routes: Routes): void {
		languages.forEach(language => {
			this.collectLanguageLocalizations(language, routes);
		});
	}

	private static transformPath(language: string, path: string, normalize = false): string {
		if (_util.isEmpty(path)) {
			return path;
		}
		const trans = normalize ? this.normalizations[language] : this.localizations[language];
		const parts = path.toLowerCase().split('/');
		let i = 0;
		while (i < parts.length && _util.isEmpty(parts[i])) {
			i += 1;
		}
		if (i < parts.length && this.languageMatcher.test(parts[i])) {
			parts[i] = normalize ? this.defaultLanguage : language;
			i += 1;
		}

		while (i < parts.length) {
			let part = parts[i];
			const indexOfHtml = part.indexOf('.html');
			if (indexOfHtml >= 0) {
				part = part.substring(0, indexOfHtml);
			}

			let prop = part;
			if (part.indexOf(':') < 0) {
				prop = _util.toUrlComponent(part);
			}

			if (trans.hasOwnProperty(prop)) {
				parts[i] = trans[prop];
			}
			i += 1;
		}
		return parts.join('/');
	}

	public static localizePath(language: string, path: string): string {
		return this.transformPath(language, path);
	}

	public static normalizePath(language: string, path: string): string {
		return this.transformPath(language, path, true);
	}

	public static localizeRoutes(language: string, routes: Routes, depth = 0): Routes {
		const locals: Routes = [];

		for (let i = 0; i < routes.length; i += 1) {
			const route = routes[i];
			const local = Object.assign({}, route);
			if (!_util.isEmpty(route['path'])) {
				local.path = this.localizePath(language, route.path);
			}
			if (!_util.isEmpty(route['redirectTo'])) {
				local.redirectTo = this.localizePath(language, route.redirectTo);
			}
			if (_util.isArray(route['children'])) {
				local.children = this.localizeRoutes(language, route.children, depth + 1);
			}
			locals.push(local);
		}

		return locals;
	}

	public static dumpState(): void {
		// Enable during debugging if required
		// console.log('Routing state', this.localizations, this.normalizations);
	}

}
