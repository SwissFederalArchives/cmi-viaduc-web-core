import {Component, Input, OnInit} from '@angular/core';
import {ErrorInfo} from '../../';

@Component({
	selector: 'cmi-error-content',
	templateUrl: 'errorContent.component.html'
})
export class ErrorContentComponent implements OnInit {

	@Input()
	public error: ErrorInfo;

	constructor() {
	}

	public ngOnInit(): void {
	}

}
