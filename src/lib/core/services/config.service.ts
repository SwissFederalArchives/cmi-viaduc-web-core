import {Injectable} from '@angular/core';
import {Utilities as _util} from '../includes';
import {UserUiSettings} from '../model';
import {PreloadService} from './preload.service';

@Injectable()
export class ConfigService {
	constructor(private _preloadService: PreloadService) {
	}

	public get defaultPagingSize(): number {
		return 10;
	}

	private _findSetting(container, key) {
		const  vs = container;
		let	v,
			ks = [],
			k = '',
			vt = vs;

		if (vs) {
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

	private _saveSetting(container, key, value) {
		let settingSection = container;
		if (settingSection) {
			if (settingSection.hasOwnProperty(key)) {
				settingSection[key] = value;
			} else {
				const keys = key.split('.');

				const lastKey = keys[keys.length - 1];
				let k = keys.shift();

				while (settingSection && keys.length >= 0) {
					if (k === lastKey) {
						settingSection[k] = value;
						break;
					} else {
						settingSection = settingSection[k];
						k = keys.shift();
					}
				}
			}
		}
	}

	public getSettings(): any {
		if (!this._preloadService.settings) {
			console.error(`preloader is NOT ready, but settings were already requested! Make sure you're using the preloaderResolver for your component. See callstack for more informations.`);
		}
		return _util.isObject(this._preloadService.settings) ? this._preloadService.settings : {};
	}

	public getSetting(key: string, defaultValue?: any): any {
		const val = this._findSetting(this.getSettings(), key);
		return  (val === undefined) ? defaultValue : val;
	}

	public setSetting(key: string, value: any): ConfigService {
		this._saveSetting(this.getSettings(), key, value);
		return this;
	}

	public removeSetting(key: string): ConfigService {
		this.setSetting(key, null);
		return this;
	}

	public setUserSettings(settings: UserUiSettings) {
		this.setSetting('user.settings', settings);
	}

	public getValidPagingSize(): number {
		let pagingSize: number;

		const userSettings = this.getUserSettings();

		if (userSettings) {
			pagingSize = userSettings.pagingSize;
		} else {
			pagingSize = this.getSetting('search.defaultPagingSize', this.defaultPagingSize);
		}

		return pagingSize;
	}

	public getUserSettings(): UserUiSettings {
		let settings = <UserUiSettings>this.getSetting('user.settings');

		if (!settings) {
			settings = <UserUiSettings>{};
		}

		// Setting default values from application config, if null or undef.
		if (settings.showInfoWhenEmptySearchResult === null || settings.showInfoWhenEmptySearchResult === undefined) {
			settings.showInfoWhenEmptySearchResult = true;
		}

		if (!settings.pagingSize) {
			settings.pagingSize = this.getSetting('search.defaultPagingSize') || this.defaultPagingSize;
		}

		if (!settings.selectedSortingField) {
			const fields = this.getSetting('search.simpleSearchSortingFields', [{
				'displayName': 'Relevanz',
				'orderBy': 'relevanz',
				'sortOrder': ''
			}]);

			settings.selectedSortingField = fields[0];
		}

		return settings;
	}
}
