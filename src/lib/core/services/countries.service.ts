import {Injectable} from '@angular/core';
import {Countries, Country} from '../model/account/country';
import {HttpService} from './http.service';
import {CoreOptions} from './coreOptions';
import {Utilities as _util} from '../includes/utilities';
import {Observable} from 'rxjs';

@Injectable()
export class CountriesService {
	private _countriesByLanguage: { [key: string]: Countries } = {};
	private _apiStammdatenUrl: string;

	constructor(private _http: HttpService,
				private _options: CoreOptions) {
		this._apiStammdatenUrl = _util.addToString(this._options.serverUrl + this._options.publicPort, '/', 'api/Stammdaten');
	}

	private _compareCountriesByName(a: Country, b: Country): number {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	}

	private _loadCountries(language: string): Promise<Countries> {
		const queryString = `?language=${language}`;
		const url = `${this._apiStammdatenUrl}/GetCountries${queryString}`;

		return this._http.get<Countries>(url).toPromise()
			.then(response => {
				this._countriesByLanguage[language] = this.sortCountriesByName(<Countries>response, false);
				return this._countriesByLanguage[language];
			})
			.catch((error) => {
				console.error(error);
				this._countriesByLanguage[language] = <Countries>[
					<Country>{
						code: 'ERROR',
						name: 'Countries could not be loaded for ' + language
					}
				];
				return this._countriesByLanguage[language];
			});
	}

	public getElasticCountries():Observable<string[]> {
		const url = `${this._apiStammdatenUrl}/GetCountriesElastic`;
		return this._http.get<string[]>(url);
	}

	public loadCountries(language: string, defaultLanguage: string = null): Promise<Countries> {
		let promises: Promise<Countries>[] = [];

		if (defaultLanguage && language !== defaultLanguage && !this.hasCountries(defaultLanguage)) {
			promises.push(this._loadCountries(defaultLanguage));
		}
		if (!this.hasCountries(language)) {
			promises.push(this._loadCountries(language));
		}

		return Promise.all(promises).then(() => {
			return this._countriesByLanguage[language];
		});
	}

	public loadCountriesAssertDefault(language: string, defaultLanguage: string): Promise<Countries> {
		return this.loadCountries(language, defaultLanguage);
	}

	public hasCountries(language: string): boolean {
		return this._countriesByLanguage.hasOwnProperty(language);
	}

	public getCountries(language: string): Countries {
		return _util.clone(this._countriesByLanguage[language]);
	}

	public getCountriesByCode(language: string): { [code: string]: Country } {
		const countries = this.getCountries(language);
		const byCode: { [code: string]: Country } = {};
		countries.forEach(country => { byCode[country.code] = country; });
		return byCode;
	}

	public sortCountriesByName(countries: Countries, clone = true): Countries {
		let cntrs = clone ? <Countries>_util.clone(countries) : countries;
		return cntrs.sort(this._compareCountriesByName);
	}
}
