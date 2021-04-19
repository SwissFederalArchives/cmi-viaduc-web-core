import {Component, Input} from '@angular/core';

@Component({
	selector: 'cmi-blocker',
	templateUrl: 'blocker.component.html',
	styleUrls: ['./blocker.component.less']
})
export class BlockerComponent {

	@Input()
	public options: any = {};

	constructor() {
	}
}
