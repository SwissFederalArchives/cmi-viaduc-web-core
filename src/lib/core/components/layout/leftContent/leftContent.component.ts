import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {Utilities as _util} from '../../../includes';

@Component({
	selector: 'cmi-viaduc-layout-left-content',
	templateUrl: 'leftContent.component.html'
})
export class LayoutLeftContentComponent implements OnInit {
	private _elem: any;
	public collapsed: boolean;

	@Output()
	public onToggle = new EventEmitter<boolean>();

	constructor(private _elemRef: ElementRef) {
		this._elem = this._elemRef.nativeElement;
	}

	public ngOnInit(): void {
		_util.initJQForElement(this._elem);
	}

	public toggleStatus(): void {
		this.collapsed = !this.collapsed;
		this.onToggle.emit(this.collapsed);
	}

	public onResize() {
		if (window.innerWidth >= 992) {
			this.collapsed = false;
		}
	}
}
