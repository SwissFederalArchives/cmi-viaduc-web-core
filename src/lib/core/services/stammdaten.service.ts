import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from './http.service';
import {CoreOptions} from './coreOptions';
import {Reason} from '../model/stammdaten/reason';
import {ArtDerArbeit} from '../model/stammdaten/artDerArbeit';

@Injectable()
export class StammdatenService {
	private _apiUrl: string;

	constructor(private _http: HttpService,
				@Inject(CoreOptions) private _options: CoreOptions) {
		this._apiUrl = this._options.serverUrl + this._options.privatePort + '/api/Stammdaten';
	}

	public getReasons(): Observable<Reason[]> {
		const url = `${this._apiUrl}/GetReasons`;
		return this._http.get<Reason[]>(url);
	}

	public getArtDerArbeiten(): Observable<ArtDerArbeit[]> {
		const url = `${this._apiUrl}/GetArtDerArbeiten`;
		return this._http.get<ArtDerArbeit[]>(url);
	}

}
