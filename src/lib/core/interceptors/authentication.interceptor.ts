import {Injectable} from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientContext } from '../services/clientContext';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
	constructor(private _context: ClientContext) {}
	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (this._context.authenticated) {
			request = request.clone({
				withCredentials: true
			});
		}

		return next.handle(request);
	}
}
