import {PipeTransform, Pipe} from '@angular/core';
import {TranslationService} from '../services/translation.service';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
	name: 'anonymizedHtml'
})

export class AnonymizedHtmlPipe implements PipeTransform {
	constructor(private translationService: TranslationService,
				private sanitizer: DomSanitizer) {}

	public transform(value: string, cssClassName = 'text-anonymized', tooltip = 'Aus Datenschutzgründen anonymisiert.', pattern = '███', container: string = null) {
		const text = this.translationService.translate(tooltip, 'anonymized.Tooltip');

		let html = `<span class=${cssClassName} data-toggle="tooltip" title="${text}" >${pattern}</span>`;
		if (container === 'body') {
			html =  `<span class=${cssClassName} data-toggle="tooltip" title="${text}" data-container="body">${pattern}</span>`;
		}
		if (value) {
			return this.sanitizer.bypassSecurityTrustHtml(value.split(pattern).join(html));
		}
		return value;
	}
}
