import {Pipe, PipeTransform} from '@angular/core';
import {TranslationService} from '../services/translation.service';

@Pipe({
	name: 'translate'
})
export class TranslatePipe implements PipeTransform {

	constructor(private _txt: TranslationService) {
	}

	public transform(value: any, key?: string, ...args: any[]): any {
		return this._txt.translate(value, key, args);
	}
}
