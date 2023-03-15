import {Injectable} from '@angular/core';
import {Utilities as _util} from '../includes/utilities';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class HttpService {
	public noCaching: any = {nonce: true};

	constructor(private _http: HttpClient) {
	}

	private _configureObservable<T>(observable: Observable<any>): Observable<T> {
		return observable;
	}

	public get<T>(url: string, config?: any): Observable<T> {
		// Prevent browsers from caching requests
		if (_util.isObject(config) && config.nonce === true) {
			url = _util.appendUrlParam(url, 'nonce=' + new Date().getTime());
		}

		return this._configureObservable<T>(this._http.get(url));
	}

	public download(url: string): Observable<HttpEvent<any>> {
		const request = new HttpRequest('GET', url, {responseType: 'blob', reportProgress: true });
		return this._http.request(request);
	}

	public delete<T>(url: string, config?: any): Observable<T> {
		// Prevent browsers from caching requests
		if (_util.isObject(config) && config.nonce === true) {
			url = _util.appendUrlParam(url, 'nonce=' + new Date().getTime());
		}

		return this._configureObservable<T>(this._http.delete(url));
	}

	public post<T>(url: string, body: any, config?: any): Observable<T> {
		// Prevent browsers from caching requests
		if (_util.isObject(config) && config.nonce === true) {
			url = _util.appendUrlParam(url, 'nonce=' + new Date().getTime());
		}

		return this._configureObservable<T>(this._http.post(url, body));
	}

	public put<T>(url: string, body: any, config?: any): Observable<T> {
		// Prevent browsers from caching requests
		if (_util.isObject(config) && config.nonce === true) {
			url = _util.appendUrlParam(url, 'nonce=' + new Date().getTime());
		}

		return this._configureObservable<T>(this._http.put(url, body));
	}
}
