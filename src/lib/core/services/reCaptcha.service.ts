import {Injectable, NgZone} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';

/*
 * https://github.com/xmaestro/angular2-recaptcha
 */
@Injectable()
export class ReCaptchaService {

	private scriptLoaded = false;
	private readySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

	constructor(zone: NgZone) {
		/* the callback needs to exist before the API is loaded */
		window[<any>'reCaptchaOnloadCallback'] = <any>(() => zone.run(this.onloadCallback.bind(this)));
	}

	public getReady(language: string): Observable<boolean> {
		if (!this.scriptLoaded) {
			this.scriptLoaded = true;
			const doc = <HTMLDivElement>document.body;
			const script = document.createElement('script');
			script.innerHTML = '';
			script.src = 'https://www.google.com/recaptcha/api.js?onload=reCaptchaOnloadCallback&render=explicit' + (language ? '&hl=' + language : '');
			script.async = true;
			script.defer = true;
			doc.appendChild(script);
		}
		return this.readySubject.asObservable();
	}

	private onloadCallback() {
		this.readySubject.next(true);
	}
}
