import {Injectable} from '@angular/core';
import {DataMap, FlexGrid} from '@grapecity/wijmo.grid';
import {FilterType, FlexGridFilter} from '@grapecity/wijmo.grid.filter';

@Injectable()
export class WijmoService {

	public setUpListColumn(grid: FlexGrid, filter: FlexGridFilter, key: string, dataMap: DataMap) {
		if (!grid || !grid.columns.getColumn(key)) {
			return;
		}

		this.setUpColumn(grid, filter, key, dataMap);
	}

	private setUpColumn(grid: FlexGrid, filter: FlexGridFilter, key: string, dataMap: DataMap) {
		if (filter.getColumnFilter(key).valueFilter.dataMap !== undefined) {
			return;
		}

		grid.columns.getColumn(key).dataMap = dataMap;
		let cf = filter.getColumnFilter(key);

		cf.filterType = FilterType.Value;
		cf.valueFilter.dataMap = dataMap;
		cf.valueFilter.uniqueValues = dataMap.getDisplayValues();
	}

	public getDataMap(enumClass, translateFn: (val) => string) {
		let pairs = [];
		for (let key of Object.keys(enumClass)) {
			let val: number = parseInt(key, 10);
			if (!isNaN(val)) {
				pairs.push({ key: val, name: translateFn(enumClass[enumClass[val]]) });
			}
		}
		return new DataMap(pairs, 'key', 'name');
	}

	public replaceExcelCorruptionCharsCallback(args: any) {
		if (args.xlsxCell && args.xlsxCell.value && typeof args.xlsxCell.value === 'string') {
			let re =  /[^(\u0020-\u007E|\u00A0-\u0217)]/g; // replace chars, that would corrupt the excelfile
			args.xlsxCell.value = args.xlsxCell.value.replace(re, '');
		}
	}
}
