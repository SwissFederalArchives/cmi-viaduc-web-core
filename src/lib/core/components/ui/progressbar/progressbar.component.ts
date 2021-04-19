import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'cmi-progressbar',
	templateUrl: './progressbar.component.html',
	styleUrls: ['./progressbar.component.less']
})
export class ProgressbarComponent implements OnInit {

constructor() { }

	@Input()
	public percentage: number = 0;

	public ngOnInit() {
	}

}
