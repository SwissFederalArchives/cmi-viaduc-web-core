import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'cmi-viaduc-column-picker',
	templateUrl: 'columnPickerControl.component.html',
	styleUrls: ['./columnPickerControl.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ColumnPickerControlComponent {
	@Input()
	public controlId: string;

	@Input()
	public set hiddenColumns(cols: any[]) {
		this._hiddenColumns = cols;
		if (this._hiddenColumns) {
			this.hiddenColumns.sort((a, b) => {
				if (a.defaultLabel === b.defaultLabel) {
					return 0;
				}

				return a.defaultLabel > b.defaultLabel ? 1 : -1;
			});
		}
	}

	public get hiddenColumns() {
		return this._hiddenColumns;
	}

	@Input()
	public visibleColumns: any[];

	@Output() // 2-Way-Binding {Variable + 'Change'}
	public showColumnPickerModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	@Input()
	public get showColumnPickerModal() {
		return this._showColumnPickerModal;
	}

	public set showColumnPickerModal(val) {
		this._showColumnPickerModal = val;
		this.showColumnPickerModalChange.emit(val);
	}

	@Output()
	public showColumnClicked: EventEmitter<any> = new EventEmitter<any>();

	@Output()
	public hideColumnClicked: EventEmitter<any> = new EventEmitter<any>();

	public selectedVisible: any;
	public selectedHidden: any;
	private _showColumnPickerModal: boolean;
	private _hiddenColumns: any[];

	public onShowColumnClick(event, column: any): void {
		this.showColumnClicked.emit(column);
		this.selectedVisible = column;
	}

	public onHideColumnClick(event, column: any): void {
		this.hideColumnClicked.emit(column);
		this.selectedHidden = column;
	}
}
