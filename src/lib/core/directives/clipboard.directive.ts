import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslationService} from '../services/translation.service';

@Directive({ selector: '[copy-clipboard]' })
export class CopyClipboardDirective {

	constructor(private _toastr: ToastrService,
				private _txt: TranslationService) {
	}

	@Input('copy-clipboard')
	public payload: string;

	@Output('copied')
	public copied: EventEmitter<string> = new EventEmitter<string>();

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent): void {

		event.preventDefault();
		if (!this.payload) {
			return;
		}

		let listener = (e: ClipboardEvent) => {
			let clipboard = e.clipboardData || window['clipboardData'];
			clipboard.setData('text', this.payload.toString());
			e.preventDefault();

			this.copied.emit(this.payload);
		};

		document.addEventListener('copy', listener, false);
		document.execCommand('copy');
		document.removeEventListener('copy', listener, false);
		this._toastr.success(this._txt.get('clipboard.success', 'Erfolgreich in die Zwischenablage kopiert!'),
			this._txt.get('clipboard.title', 'Zwischenablage'));
	}
}
