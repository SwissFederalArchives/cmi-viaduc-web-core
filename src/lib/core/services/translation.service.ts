import {Injectable} from '@angular/core';
import {Language, Translations} from '../model/translations';
import {ClientContext} from './clientContext';
import {PreloadService} from './preload.service';
import {Utilities as _util} from '../includes/utilities';

@Injectable()
export class TranslationService {
	private _supportedLanguages: Language[];

	private _language: string;
	private _texts: { [key: string]: any };

	private _commonKey: string = '_';
	private _showMissingInfo: boolean = true;
	private _isLocalhost: boolean = false;

	constructor(private _context: ClientContext, private _preloadService: PreloadService) {
		let supported: any[] = [];
		supported.push(<Language>{key: 'de', short: 'DE', name: 'Deutsch'});
		supported.push(<Language>{key: 'fr', short: 'FR', name: 'Français'});
		supported.push(<Language>{key: 'it', short: 'IT', name: 'Italiano'});
		supported.push(<Language>{key: 'en', short: 'EN', name: 'English'});
		this._supportedLanguages = supported;

		this._setup();

		this._preloadService.translationsLoaded.subscribe(translations => {
			if (translations && translations.language === this._language) {
				this._setup(true);
			}
		});

		this._isLocalhost = window.location.hostname === 'localhost';
	}

	public get showMissingInfo(): boolean {
		return this._showMissingInfo;
	}

	public set showMissingInfo(value: boolean) {
		this._showMissingInfo = value;
	}

	public getMissingInfo(language: string, text: string): string {
		if (_util.isString(text) && /^(http|https|file|mail)\:\/\//.test(text)) {
			return text + '?(!' + language + ')';
		} else {
			return '(!' + language + ')' + text;
		}
	}

	public get supportedLanguages(): Language[] {
		return this._supportedLanguages;
	}

	private _setup(forced = false): void {
		if (!forced && !_util.isEmpty(this._texts) && this._language === this._context.language) {
			return;
		}

		let language = this._context.language;
		let supported = this._supportedLanguages.filter(t => t.key === language).pop();
		if (!supported) {
			language = this._context.defaultLanguage;
		}

		let selected: Translations = this._preloadService.translationsByLanguage[language];
		this._language = language;
		this._texts = selected && selected.translations ? _util.cloneWithLowerCasedKeys(selected.translations) : undefined;
	}

	public update(): void {
		this._setup();
	}

	private _findText(key: string): any {
		let ts = this._texts,
			t = null,
			ks = [],
			k = '',
			tt = ts;

		if (!_util.isEmpty(key) && ts) {
			key = key.toLocaleLowerCase();
			key = this.normalizeKey(key);
			ks = key.split('.');
			// search in common
			if (!t && ks.length === 1 && ts[this._commonKey]) {
				// search in common
				t = ts[this._commonKey][ks[0]];
			}
			// search by name space
			while (!t && tt && ks.length > 0) {
				k = ks.shift();
				tt = tt[k];
				t = tt ? tt[ks.join('.')] : null;
			}
			// search by full (multi-part) key
			if (!t) {
				t = ts[key];
			}

			if (t && !_util.isString(t)) {
				t = null;
			}
		}

		if (!t && this._isLocalhost) {
			console.warn('missing translation: didnt find value for key ', key);
		}
		return t;
	}

	public has(key: string): boolean {
		return _util.isDefined(this._findText(key));
	}

	public get(key: string, defaultValue?: string, ...args: any[]): string {
		let t = this._findText(key);

		if (!t) {
			t = defaultValue || key;
			if (this._showMissingInfo && (this._language !== this._context.defaultLanguage)) {
				t = this.getMissingInfo(this._context.language, t);
			}
		}

		if (t && t.indexOf('{') >= 0) {
			let ps = [t],
				ar = _util.isArray(args) ? args : [];
			while (ar.length === 1 && _util.isArray(ar[0])) {
				ar = ar[0];
			}
			ps = ps.concat(ar);
			t = _util.format.apply(_util, ps);
		}

		return t;
	}

	private _find(container: any, key: string): any {
		let vs = container,
			v,
			ks = [],
			k = '',
			vt = vs;

		if (vs) {
			key = key.toLocaleLowerCase();
			key = this.normalizeKey(key);
			ks = key.split('.');
			// search by name space
			while ((v === undefined) && vt && ks.length > 0) {
				k = ks.shift();
				vt = vt[k];
				v = vt ? vt[ks.join('.')] : undefined;
			}
			// search by full (multi-part) key
			if (v === undefined) {
				v = vs[key];
			}
		}
		return v;
	}

	public pick(obj: any, key: string, language: string, allowDefault: boolean): string {
		let t = null,
			o = this._find(obj, key),
			defLang = this._context.defaultLanguage;

		if (_util.isObject(o)) {
			if (o.hasOwnProperty(language)) {
				t = o[language];
			} else if ((allowDefault !== true) && (language !== defLang) && (o.hasOwnProperty(defLang))) {
				t = o[defLang];
				if (this._showMissingInfo) {
					t = this.getMissingInfo(language, t);
				}
			}
		}
		if (t === null && this._showMissingInfo) {
			t = this.getMissingInfo(language, key);
		}
		return t;
	}

	public translate(text: string, key?: string, ...args: any[]): string {
		return this.get((key || text), text, args);
	}

	private normalizeKey(key?: string): string {
		if (!key) {
			return key;
		}

		return key.replace(/ä/g, 'ae' )
			.replace(/ö/g, 'oe')
			.replace(/ü/g, 'ue');
	}
}
