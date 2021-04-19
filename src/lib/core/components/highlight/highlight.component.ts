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

	public constructor() {
	}
	public getInnerHTML(): string {
		if (this.text && this.highlight) {
			let position = this.text.toLowerCase().indexOf(this.highlight.toLowerCase());
			if (position !== -1) {
				let innerHTML: string = '',
					replaceString = this.text.substr(position, this.highlight.length),
					split = this.text.split(replaceString),
					last = split.pop();

				for (let s of split) {
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
