import {Pipe, PipeTransform} from '@angular/core';
import {TranslationService} from '../services/translation.service';

@Pipe({
	name: 'measure'
})
export class MeasurePipe implements PipeTransform {
	constructor(private _txt: TranslationService) {
	}

	public transform(value: number, measure: string, ...args: any[]): any {
		let result: any = value;
		switch (measure) {
			case 'FileSize': {
				result = this._humanFileSize(value);
				break;
			}
		}
		return result;
	}

	private _humanFileSize(bytes: number, si = true): string {
		let thresh = si ? 1000 : 1024;
		if (Math.abs(bytes) < thresh) {
			return bytes + ' B';
		}
		let units = si
			? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
			: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
		let u = -1;
		do {
			bytes /= thresh;
			++u;
		} while (Math.abs(bytes) >= thresh && u < units.length - 1);
		return bytes.toFixed(1) + ' ' + this._txt.get('fileSize.' + units[u], units[u]);
	}
}
