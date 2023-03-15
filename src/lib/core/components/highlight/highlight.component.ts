import {Component, Input} from '@angular/core';

@Component({
	selector: 'cmi-viaduc-highlight',
	templateUrl: './highlight.component.html',
	styleUrls: ['./highlight.component.less']
})

export class HighlightComponent {
	@Input()
	public highlight: string;
	@Input()
	public text: string;

	public getInnerHTML(): string {
		if (this.text && this.highlight) {
			const position = this.text.toLowerCase().indexOf(this.highlight.toLowerCase());
			if (position !== -1) {
				let innerHTML = '';
				const replaceString = this.text.substr(position, this.highlight.length);
				const split = this.text.split(replaceString);
				const last = split.pop();

				for (const s of split) {
					innerHTML += s;
					innerHTML += '<ins>' + replaceString + '</ins>';
				}
				innerHTML += last;
				return innerHTML;
			}
		}
		return this.text;
	}
}
