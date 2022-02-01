import {
	Component, OnInit, ViewChild,
	ViewContainerRef} from '@angular/core';
import {ModalService} from './modal.service';

@Component({
	selector: 'cmi-viaduc-modal-service-container',
	template: `<div #modalcontainer></div>`
})
export class ModalContainerComponent implements OnInit {
	@ViewChild('modalcontainer', {static: true, read: ViewContainerRef})
	public viewContainerRef: ViewContainerRef;

	constructor(
		private modalService: ModalService) {
	}

	public ngOnInit() {
		this.modalService.RegisterContainerRef(this.viewContainerRef);
	}
}
