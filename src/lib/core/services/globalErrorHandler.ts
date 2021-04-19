import {ApplicationRef, ErrorHandler, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ActiveToast, ToastrService} from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;
import {TranslationService} from './translation.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

	private _txt: TranslationService;
	private _toastr: ToastrService;
	constructor(private _injector: Injector) {
		super();
	}

	public handleError(error) {
		this._handleErrorInternal(error);
	}

	private _handleErrorInternal(e: any) {
		if (window.location.hostname === 'localhost') {
			console.error(e);
		}

		this._txt = this._injector.get(TranslationService);
		this._toastr = this._injector.get(ToastrService);
		let appRef = this._injector.get(ApplicationRef);

		const errorTitle = this._txt.get('errors.errorTitle', 'Fehler');

		if (e && e instanceof HttpErrorResponse) {
			/* display server errors directly */
			this._logAndShowHttpError(e, errorTitle);
			return;
		}

		const unknownErrorMessage = this._txt.get('error.unknownErrorMessage',
		'Es ist ein unerwartender Fehler aufgetreten. Klicken Sie hier, um die Seite neu zu laden oder versuchen Sie es später erneut');

		if (e) {
			this._logJSError(e); /* just log unhandled javascript errors here and show it as unpexected error later */
		} else {
			this._logError(unknownErrorMessage, 'UNKNOWN ERROR');
		}

		let err = this._toastr.error(unknownErrorMessage, errorTitle,	{
			disableTimeOut: true,
			closeButton: true,
			easeTime: 50,
			positionClass: 'toast-top-center'});

		if (err) { // toast is null if it's a duplicate
			this._addClickListener(err);
			let sub = err.onShown.subscribe(() => {
				appRef.tick();

				if (sub) {
					sub.unsubscribe();
				}
			});
		}

	}

	private _addClickListener(err: ActiveToast<any>) {
		if (!err) {
			return;
		}

		let sub = err.onTap.subscribe(() => {
			this._refreshCurrentPage();
			if (sub) {
				sub.unsubscribe();
			}
		});
	}

	private _logJSError(e: any) {
		let msg = e.message || e;

		if (e instanceof TypeError) {
			this._logError(msg, 'TYPE ERROR');
		} else if (e instanceof DOMError) {
			this._logError(msg, 'DOM ERROR');
		} else if (e instanceof EvalError) {
			this._logError(msg, 'EVAL ERROR');
		} else if (e instanceof RangeError) {
			this._logError(msg, 'RANGE ERROR');
		} else if (e instanceof URIError) {
			this._logError(msg, 'URI ERROR');
		} else if (e.toString() === '[object PositionError]') {
			this._logError(msg, 'POSITION ERROR');
		} else if (e instanceof SyntaxError) {
			this._logError(msg, 'SYNTAX ERROR');
		} else if (e instanceof ReferenceError) {
			this._logError(msg, 'REFERENCE ERROR');
		} else if (e instanceof MediaError) {
			this._logError(msg, 'MEDIA ERROR');
		} else if (e.toString() === '[object MediaStreamError]') {
			this._logError(msg, 'MEDIASTREAM ERROR');
		} else {
			this._logError(msg, 'ERROR');
		}
	}

	private _logAndShowHttpError(e: any, errorTitle) {
		let msg = (e.error || {}).exceptionMessage;
		msg = msg || e.message;
		const index = msg.indexOf('faulted:');
		if (index > 0) {
			msg = msg.substr(index + 'faulted:'.length);
		}
		this._logError(msg, 'HTTP ERROR');
		this._toastr.error(msg, errorTitle, {disableTimeOut: true, closeButton: true, positionClass: 'toast-top-center'});
	}

	private _logError(error, category: string) {
		const date = `${moment().format('DD.MM.YYYY, HH:mm:ss')} | ${category} | `;
		console.error(date, error);
	}

	private _refreshCurrentPage() {
		window.location.reload(true);
	}
}
