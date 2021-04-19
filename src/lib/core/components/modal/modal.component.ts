import {Component, ViewEncapsulation, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UiService} from '../../services/ui.service';
@Component({
	selector: 'cmi-viaduc-modal',
	templateUrl: 'modal.component.html',
	styleUrls: ['modal.component.less'],
	encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {

	@Input()
	public modalTitle: string;

	@Output() // 2-Way-Binding {Variable + 'Change'}
	public openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	@Output() // Raised when the closed button of the modal form is clicked
	public closeClicked: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('modalContent', { static: true })
	public modalContent: ElementRef;

	@Input()
	public get opened() {
		return this._opened;
	}
	public set opened(val) {
		this._opened = val;
		this.openedChange.emit(val);
	}

	private _opened: boolean;

	constructor(private _ui: UiService) {
	}

	public ngOnInit(): void {
	}

	public closeModal(event: any): void {
		this.opened = false;

		if (event) {
			event.stopPropagation();
		}
		this.closeClicked.emit();
	}

	public get display(): string {
		return this.opened ? 'block' : 'none';
	}

	@HostListener('click', ['$event'])
	public onComponentClick(event: any) {
		if (!this._ui.detectInsideClick(event, this.modalContent.nativeElement)) {
			this.closeModal(null);
		}
	}

}
