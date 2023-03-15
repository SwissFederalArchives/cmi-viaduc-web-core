import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {ConfigService} from '../../../services/config.service';
import {ClientContext } from '../../../services/clientContext';
import {ReCaptchaService} from '../../../services/reCaptcha.service';

/*
 * https://github.com/xmaestro/angular2-recaptcha
 */
@Component({
	selector: 're-captcha',
	template: '<div #target></div>',
})
export class ReCaptchaComponent implements OnInit, OnDestroy, ControlValueAccessor {

	@Input()
	public site_key: string = null;
	@Input()
	public theme = 'light';
	@Input()
	public type = 'image';
	@Input()
	public size = 'normal';
	@Input()
	public tabindex = 0;
	@Input()
	public badge = 'bottomright';

	@Output()
	public captchaResponse = new EventEmitter<string>();
	@Output()
	public captchaExpired = new EventEmitter();

	@ViewChild('target', { static: true })
	public targetRef: ElementRef;

	private widgetId: any = null;

	constructor(
		private _zone: NgZone,
		private _context: ClientContext,
		private _configService: ConfigService,
		private _captchaService: ReCaptchaService,
	) {
	}

	public ngOnInit() {
		const key = this._configService.getSetting('access.captcha.key');
		const theme = this._configService.getSetting('access.captcha.theme') || 'light';
		const language = this._context.language;
		this._captchaService.getReady(language)
			.subscribe((ready) => {
				if (!ready) {
					return;
				}
				// noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
				this.widgetId = (<any>window).grecaptcha.render(this.targetRef.nativeElement, {
					'sitekey': key,
					'theme': theme,
					'badge': this.badge,
					'type': this.type,
					'size': this.size,
					'tabindex': this.tabindex,
					'callback': <any>((response: any) => this._zone.run(this.reCaptchaCallback.bind(this, response))),
					'expired-callback': <any>(() => this._zone.run(this.reCaptchaExpiredCallback.bind(this))),
				});
			});
	}

	public ngOnDestroy() {
		if (this.widgetId === null) {
			return;
		}
		// noinspection TypeScriptUnresolvedVariable
		(<any>window).grecaptcha.reset(this.widgetId);
	}

	// noinspection JSUnusedGlobalSymbols
	public reset() {
		if (this.widgetId === null) {
			return;
		}
		// noinspection TypeScriptUnresolvedVariable
		(<any>window).grecaptcha.reset(this.widgetId);
	}

	// noinspection JSUnusedGlobalSymbols
	public execute() {
		if (this.widgetId === null) {
			return;
		}
		// noinspection TypeScriptUnresolvedVariable
		(<any>window).grecaptcha.execute(this.widgetId);
	}

	public getResponse(): string {
		if (this.widgetId === null) {
			return;
		}
		// noinspection TypeScriptUnresolvedVariable
		return (<any>window).grecaptcha.getResponse(this.widgetId);
	}

	public writeValue(newValue: any): void {
		/* ignore it */
	}

	public registerOnChange(fn: any): void {
		/* ignore it */
	}

	public registerOnTouched(fn: any): void {
		/* ignore it */
	}

	private reCaptchaCallback(response: string) {
		this.captchaResponse.emit(response);
	}

	private reCaptchaExpiredCallback() {
		this.captchaExpired.emit();
	}
}
