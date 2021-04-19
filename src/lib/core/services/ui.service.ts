import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class UiService {
	constructor(private _toastr: ToastrService) {
	}

	public detectInsideClick(event: any, element: any): boolean {
		let target = event.target;
		let inside = false;
		do {
			if (target === element) {
				inside = true;
			}
			target = target.parentNode;
		} while (target && !inside);
		return inside;
	}

	public showError(e: any) {
		const httpError = e as HttpErrorResponse;
		if (httpError) {
			let msg = (httpError.error || {}).exceptionMessage;
			msg = msg || httpError.message;

			const index = msg.indexOf('faulted:');
			if (index > 0) {
				msg = msg.substr(index + 'faulted:'.length);
			}
			this._toastr.error(msg, 'Fehler', { disableTimeOut: true, closeButton: true});
			return;
		}
		if (e) {
			this._toastr.error(e.message || e, 'Fehler', { disableTimeOut: true, closeButton: true});
			return;
		}

		this._toastr.error('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut', 'Fehler', { disableTimeOut: true, closeButton: true});
	}
}
