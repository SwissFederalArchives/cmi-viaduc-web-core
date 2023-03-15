import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';
import {HttpService} from './http.service';
import {CoreOptions} from './coreOptions';
import {Translations} from '../model/translations';
import {Utilities as _util} from '../includes/utilities';

const inlinedTranslationsIdPrefix = 'viaduc-translations-';
const inlinedSettingsId = 'viaduc-settings';
const inlinedModelDataId = 'viaduc-model';

@Injectable()
export class PreloadService {

	public translationsByLanguage: { [key: string]: Translations } = {};
	public settings: any = null;
	public modelData: any = null;

	private _isPreloading = false;
	public get isPreloading(): boolean {
		return this._isPreloading;
	}

	private _isPreloaded = false;
	public get isPreloaded(): boolean {
		return this._isPreloaded;
	}

	public translationsLoaded: BehaviorSubject<Translations>; // behavioursubject, because translations are loaded with app_initializer
	public settingsloaded: Subject<any>;
	public modelDataLoaded: Subject<any>;
	public preloaded: Subject<boolean>;

	private _apiDataUrl: string;
	private _translations: Translations;

	constructor(private _options: CoreOptions,
				private _http: HttpService) {
		this.translationsLoaded = new BehaviorSubject<Translations>(this._translations);
		this.settingsloaded = new Subject<any>();
		this.modelDataLoaded = new Subject<any>();
		this.preloaded = new Subject<boolean>();

		this._apiDataUrl = _util.addToString(this._options.serverUrl + this._options.publicPort, '/', 'api/Public');
	}

	public preload(lang: string, loadModelData = true): Promise<boolean> {
		this._isPreloading = true;
		return Promise.all([
			this._loadTranslations(lang),
			this._loadSettings(),
			loadModelData ? this._loadModelData() : () => void 0,
		]).then(() => {
			this._isPreloading = false;
			this._isPreloaded = true;
			this.preloaded.next(true);
			return true;
		});
	}

	public hasTranslationsFor(language: string): boolean {
		return this.translationsByLanguage.hasOwnProperty(language);
	}

	public loadTranslationsFor(language: string): Promise<any> {
		return this._loadTranslations(language);
	}

	private _loadTranslations(language: string): Promise<any> {
		let promise: Promise<any> = null;

		const inlined = document.getElementById(inlinedTranslationsIdPrefix + language);
		if (inlined && inlined.innerHTML) {
			try {
				const translations = JSON.parse(inlined.innerHTML);
				promise = new Promise((resolve, reject) => {
					resolve(translations);
				});
			} catch (ex) {
				console.error('PreloadService._loadTranslations: failed to load inlined translations.', ex);
			}
		}

		if (promise === null) {
			const queryString = `?language=${language}`;
			const url = `${this._apiDataUrl}/GetTranslations${queryString}`;
			promise = this._http.get<any>(url, this._http.noCaching).toPromise();
		}

		return promise.then(translations => {
			const ts = this.translationsByLanguage[language] = <Translations>{
				language: language,
				translations: translations
			};
			this._translations = ts;
			this.translationsLoaded.next(this._translations);
		});
	}

	private _loadSettings(): Promise<any> {
		let promise: Promise<any> = null;

		const inlined = document.getElementById(inlinedSettingsId);
		if (inlined && inlined.innerHTML) {
			try {
				const settings = JSON.parse(inlined.innerHTML);
				promise = new Promise((resolve, reject) => {
					resolve(settings);
				});
			} catch (ex) {
				console.error('PreloadService._loadSettings: failed to load inlined translations.', ex);
			}
		}

		if (promise === null) {
			const queryString = ``;
			const url = `${this._apiDataUrl}/GetSettings${queryString}`;
			promise = this._http.get<any>(url, this._http.noCaching).toPromise();
		}

		return promise.then(settings => {
			this.settings = settings;
			this.settingsloaded.next(settings);
		});
	}

	private _loadModelData(): Promise<any> {
		let promise: Promise<any> = null;

		const inlined = document.getElementById(inlinedModelDataId);
		if (inlined && inlined.innerHTML) {
			try {
				const modelData = JSON.parse(inlined.innerHTML);
				promise = new Promise((resolve, reject) => {
					resolve(modelData);
				});
			} catch (ex) {
				console.error('PreloadService._loadModelData: failed to load inlined translations.', ex);
			}
		}

		if (promise === null) {
			const queryString = ``;
			const url = `${this._apiDataUrl}/GetModelData${queryString}`;
			promise = this._http.get<any>(url, this._http.noCaching).toPromise();
		}

		return promise.then(modelData => {
			this.modelData = modelData;
			this.modelDataLoaded.next(modelData);
		});
	}
}
