import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ODataCollectionView} from '@grapecity/wijmo.odata';
import {Utilities as _util} from '../../../includes';
import {CollectionView} from '@grapecity/wijmo';

@Component({
	selector: 'cmi-viaduc-odata-pagination',
	templateUrl: 'oDataPagination.component.html',
	styleUrls: ['./oDataPagination.component.less']
})
export class ODataPaginationComponent {

	private _collectionView: ODataCollectionView;

	@Output() // 2-Way-Binding {Variable + 'Change'}
	public collectionViewChange: EventEmitter<ODataCollectionView> = new EventEmitter<ODataCollectionView>();

	public get collectionView() {
		return this._collectionView;
	}

	@Input()
	public set collectionView(val) {
		this._collectionView = val;
		this.collectionViewChange.emit(val);

		if (this._collectionView) {
			if (this._collectionView.loaded) {
				this._collectionView.loaded.addHandler(() => {
					this.collectionViewChange.emit(this._collectionView);
				});
			} else {
				(<CollectionView>this._collectionView).collectionChanged.addHandler(() => {
					this.collectionViewChange.emit(this._collectionView);
				});
			}
		}
	}

	@Input()
	public possiblePagingSizes: number[] = [10, 25, 50, 100];

	public items: any[] = [];
	public previousPagingSize = 0;
	public previousItemCount = 0;

	constructor() {
		this.collectionViewChange.subscribe(() => {
			this._refresh();
			this.previousPagingSize = this.collectionView.pageSize;
			this.previousItemCount = this.collectionView.itemCount;
		});
	}

	private _addItem(index: number, label?: string, active?: boolean, enabled?: boolean): any {
		if (active === undefined) {
			active = (index === this.pageIndex);
		}

		if (active) {
			enabled = false;
		} else {
			enabled = (enabled === undefined) ? true : enabled;
		}

		const item = {
			index: index,
			label: _util.isEmpty(label) ? '' + (index + 1) : label,
			enabled: enabled,
		};
		this.items.push(item);
		return item;
	}

	private _refresh(): void {
		const index = this.pageIndex;
		const ilast = this.pageCount - 1;

		this.items.splice(0, this.items.length);

		let ibase = Math.max(0, Math.min(ilast - 5, index - 2));

		if (ibase > 0) {
			this._addItem(0);
		}
		if (ibase > 1) {
			this._addItem(Math.max(1, ibase - 5), '...', false);
		}

		for (let i = 0; i < 5 && ibase <= ilast; i += 1, ibase += 1) {
			this._addItem(ibase);
		}
		ibase -= 1; // ibase is increment inside for

		if (ibase < ilast - 1) {
			this._addItem(Math.min(ilast - 1, ibase + 5), '...', false);
		}
		if (ibase < ilast) {
			this._addItem(ilast);
		}
	}

	public get pageIndex(): number {
		return this.collectionView.pageIndex;
	}

	public get pageCount(): number {
		return this.collectionView.pageCount;
	}

	public onChangePageSize() {
		this.collectionView.moveToFirstPage();
		this._refresh();
	}

	public setPageIndex(i: number): void {
		if (i < 0) {
			i = 0;
		}
		this.collectionView.moveToPage(i);
	}
}
