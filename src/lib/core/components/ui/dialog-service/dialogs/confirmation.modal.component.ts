import { Component } from '@angular/core';
import { ModalBase } from '../modal/modal.base';
import {CanDeactivateData} from '../../../../model';

@Component({
	selector: 'cmi-viaduc-confirmation-modal',
	template: `
		<cmi-viaduc-modal-service>
			<cmi-viaduc-modal [modalTitle]="title" (closeClicked)="onCancelInternal()" opened="true">
				<cmi-viaduc-modal-body>
					<div [innerHTML]="content"></div>
				</cmi-viaduc-modal-body>
				<cmi-viaduc-modal-footer>
					<div class="row">
						<div class="col-xs-12">
							<button type="button" autoFocus class="btn btn-secondary" (click)="onCancelInternal()">
								{{noButtonText}}
							</button>
							<button type="button" class="btn btn-primary" (click)="onOkInternal()">
								{{yesButtonText}}
							</button>
						</div>
					</div>
				</cmi-viaduc-modal-footer>
			</cmi-viaduc-modal>
		</cmi-viaduc-modal-service>`
})

export class ConfirmationModalComponent extends ModalBase {
	public title: string;
	public content: string;
	public yesButtonText: string;
	public noButtonText: string;
	public candeactive: CanDeactivateData

	public onCancelInternal(): void {
		this.candeactive.result.emit(false);
		this.closeModal();
	}

	public onOkInternal(): void {
		this.candeactive.result.emit(true);
		this.closeModal();
	}
}
