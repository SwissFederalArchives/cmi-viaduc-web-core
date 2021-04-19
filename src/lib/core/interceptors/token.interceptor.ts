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
export class TokenInterceptor implements HttpInterceptor {
	constructor(private _context: ClientContext) {}
	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let headers = this._context.getRequestHeaders();

		if (headers) {
			request = request.clone({
				setHeaders: headers
			});
		}

		return next.handle(request);
	}
}
