import { Component } from '@angular/core';
import { ModalBase } from '../modal/modal.base';

@Component({
	selector: 'cmi-viaduc-basic-modal',
	template: `
    <cmi-viaduc-modal [modalTitle]="title" (closeClicked)="onClose()" opened="true">
		<cmi-viaduc-modal-body>
			<div [innerHTML]="content"></div>
		</cmi-viaduc-modal-body>
		<cmi-viaduc-modal-footer>
			<div class="row">
				<div class="col-xs-12">
					<button type="button" autoFocus class="btn btn-primary" (click)="onClose()">
						{{closeButtonText}}
					</button>
				</div>
			</div>
		</cmi-viaduc-modal-footer>
    </cmi-viaduc-modal>`
})
export class BasicModalComponent extends ModalBase {
	public title: string;
	public content: string;
	public closeButtonText: string;

	public onClose(): void {
		this.closeModal();
	}
}
