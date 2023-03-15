import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Countries} from '../model/account/country';
import {CountriesService} from '../services/countries.service';
import {Utilities as _util} from '../includes';
import {ClientContext} from '../services/clientContext';

@Injectable()
export class CountriesResolver implements Resolve<any> {
	constructor(private _context: ClientContext, private _countriesService: CountriesService) {
	}

	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PromiseLike<Countries> | Countries {
		if (!_util.isEmpty(this._context.loadingLanguage)) {
			return this._getOrAssertCountry(this._context.loadingLanguage);
		} else {
			return this._getOrAssertCountry(this._context.language);
		}
	}

	private _getOrAssertCountry(lang: string): (PromiseLike<Countries> | Countries) {
		if (this._countriesService.hasCountries(lang)) {
			return this._countriesService.getCountries(lang);
		} else {
			return this._countriesService.loadCountriesAssertDefault(lang, this._context.defaultLanguage).then(() => {
				return this._countriesService.getCountries(lang);
			});
		}
	}
}
