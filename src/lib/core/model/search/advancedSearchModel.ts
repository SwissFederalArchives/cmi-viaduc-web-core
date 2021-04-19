import {AdvancedSearchGroup} from './advancedSearchGroup';
import {GroupOperator} from './groupOperator';
import {SearchModel} from './searchModel';

export class AdvancedSearchModel implements SearchModel {
	public searchGroups: AdvancedSearchGroup[] = [];
	public groupOperator: GroupOperator = GroupOperator.AND;

	public constructor() {
	}

	public deleteGroup(grp: AdvancedSearchGroup): void {
		let index = this.searchGroups.indexOf(grp, 0);
		if (index > -1) {
			this.searchGroups.splice(index, 1);
		}
	}
}
