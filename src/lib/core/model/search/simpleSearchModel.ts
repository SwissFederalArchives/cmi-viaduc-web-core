import {SearchField} from './searchModel';

export class SimpleSearchModel {
	public term: string;
	public dateRange: SearchField;

	constructor() {
		this.dateRange = <SearchField>{key: 'creationPeriod', value: null};
	}
}
