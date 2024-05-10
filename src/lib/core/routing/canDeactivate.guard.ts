import {Injectable} from '@angular/core';

import {ComponentCanDeactivate} from '../model/component-can-deactivate';
import {ModalService} from '../components/ui/dialog-service/modal/modal.service';
import {TranslationService} from '../services/translation.service';
import {CanDeactivateData} from '../model';

@Injectable()
export class CanDeactivateGuard  {

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
		const canDeactivateData = new CanDeactivateData() ;
		canDeactivateData.title = this.txt.get('canDeactivateGuard.Title', 'Warnung');
		canDeactivateData.content = message;
		canDeactivateData.yesButtonText = this.txt.get('canDeactivateGuard.yes', 'Ja')
		canDeactivateData.noButtonText = this.txt.get('canDeactivateGuard.no', 'Nein');
		canDeactivateData.result.subscribe((result: boolean) => {
			this.dialogResult = result;
			this.dialogIsClosed = true;
		});
		this.modalService.openDialog(canDeactivateData);
	}

	private showSimpleMessage(message: string) {
		const canDeactivateData = new CanDeactivateData() ;
		canDeactivateData.title = this.txt.get('canDeactivateGuard.Title', 'Warnung');
		canDeactivateData.content = message;
		canDeactivateData.closeButtonText = this.txt.get('canDeactivateGuard.close', 'Schliessen'),
		canDeactivateData.result.subscribe((result: boolean) => {
			this.dialogResult = result; // is always false
			this.dialogIsClosed = true;
		});
		this.modalService.openMessage(canDeactivateData);
	}
}
