import { Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {ComponentCanDeactivate} from '../model/component-can-deactivate';
import {ModalService} from '../components/ui/dialog-service/modal/modal.service';
import {BasicModalComponent, ConfirmationModalComponent} from '../components';
import {TranslationService} from '../services/translation.service';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {

	private dialogResult: boolean;
	private dialogIsClosed: boolean;

	constructor(private modalService: ModalService,
				private txt: TranslationService) {
	}

	public async canDeactivate(component: ComponentCanDeactivate): Promise<boolean>  {
		if (!component.canDeactivate()) {
			switch (component.promptForMessage()) {
				case 'message':
					this.dialogIsClosed = false;
					this.showSimpleMessage(component.message());
					while (!this.dialogIsClosed) {
						await this.sleep(200);
					}
					return false;
				case 'question':
					this.dialogIsClosed = false;
					this.openConfirmationModal(component.message());
					while (!this.dialogIsClosed) {
						await this.sleep(200);
					}
					return this.dialogResult;
				case false:
					return false;
				default:
					return false;
			}
		}
		return true;
	}

	private async sleep (ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private openConfirmationModal(message: string) {
		this.modalService.open(ConfirmationModalComponent,
			{
				title: this.txt.get('canDeactivateGuard.Title', 'Warnung'),
				content: message,
				yesButtonText: this.txt.get('canDeactivateGuard.yes', 'Ja'),
				noButtonText: this.txt.get('canDeactivateGuard.no', 'Nein'),
				onOk: () => { this.dialogResult = true; this.dialogIsClosed = true; },
				onCancel: () => { this.dialogResult = false; this.dialogIsClosed = true; }

			});
	}

	private showSimpleMessage(message: string) {
		this.modalService.open(BasicModalComponent,
			{
				title: this.txt.get('canDeactivateGuard.Title', 'Warnung'),
				content: message,
				closeButtonText: this.txt.get('canDeactivateGuard.close', 'Schliessen'),
				onOk: () => { this.dialogResult = true; this.dialogIsClosed = true; },
				onCancel: () => { this.dialogResult = false; this.dialogIsClosed = true; }

			});
	}
}
