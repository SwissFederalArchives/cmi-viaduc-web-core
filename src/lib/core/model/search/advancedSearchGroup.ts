import {FieldOperator} from './fieldOperator';
import {SearchGroup} from './searchModel';
import {AdvancedSearchField} from './advancedSearchField';

export class AdvancedSearchGroup implements SearchGroup {
	public searchFields: AdvancedSearchField[] = [];
	public fieldOperator: FieldOperator = FieldOperator.And;

	public id: number;

	public changeField(field: AdvancedSearchField): void {
		const index = this.searchFields.map(f => f.id).indexOf(field.id);
		if (index > -1) {
			this.searchFields[index] = field;
		}
	}

	public deleteField(field: AdvancedSearchField): void {
		const index = this.searchFields.indexOf(field, 0);
		if (index > -1) {
			this.searchFields.splice(index, 1);
		}
	}

	public toggleLinkingType(operator: string) {
		switch (operator) {
			case 'AND':
				this.fieldOperator = FieldOperator.And;
				break;
			case 'OR':
				this.fieldOperator = FieldOperator.Or;
				break;
			case 'NOT':
				this.fieldOperator = FieldOperator.Not;
				break;
		}
	}

	public getToggleStatusForAnd() {
		return (this.fieldOperator === FieldOperator.And) ? 'checked' : '';
	}

	public getToggleStatusForOr() {
		return (this.fieldOperator === FieldOperator.Or) ? 'checked' : '';
	}

	public getToggleStatusForNot() {
		return (this.fieldOperator === FieldOperator.Not) ? 'checked' : '';
	}
}
