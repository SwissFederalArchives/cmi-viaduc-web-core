import {Paging} from '../paging';
import {Utilities as _util} from '../../includes/utilities';
import {AdvancedSearchField} from './advancedSearchField';
import {SearchField, SearchModel} from './searchModel';
import {FieldOperator} from './fieldOperator';
import {GroupOperator} from './groupOperator';
import {SimpleSearchModel} from './simpleSearchModel';

export const END_OF_QUERY_MARKER = 'eoq';

export interface SearchOptions {
	enableExplanations: boolean;
	enableHighlighting: boolean;
	enableAggregations: boolean;
}

export interface FacetteFilter {
	facet: string;
	filters: string[];
}

export interface CaptchaVerificationData {
	ip: string;
	token: string;
}

export class SearchRequest {
	public query: SearchModel;
	public paging: Paging;
	public facetsFilters: FacetteFilter[];
	public options: SearchOptions;
	public advancedSearch: boolean;

	public captcha: CaptchaVerificationData;

	public static createSearchModelFromSimple(simpleModel: SimpleSearchModel): SearchModel {
		let field = new AdvancedSearchField();
		field.value = simpleModel.term;
		field.key = 'allData';

		let fields: SearchField[] = [field];
		if (simpleModel.dateRange) {
			fields.push(simpleModel.dateRange);
		}

		return <SearchModel> {
			searchGroups: [{searchFields: fields, fieldOperator: FieldOperator.And}],
			groupOperator: GroupOperator.AND
		};
	}

	public static toQueryString(request: SearchRequest): string {
		const q = request;

		let qs = 'q=' + encodeURIComponent(JSON.stringify(q.query));

		if (!_util.isEmpty(q.facetsFilters)) {
			qs = _util.addToString(qs, '&', 'pf=' + encodeURIComponent(JSON.stringify(q.facetsFilters)));
		}
		if (!_util.isEmpty(q.options)) {
			qs = _util.addToString(qs, '&', 'op=' + encodeURIComponent(JSON.stringify(q.options)));
		}
		if (!_util.isEmpty(q.paging)) {
			qs = _util.addToString(qs, '&', 'pa=' + encodeURIComponent(JSON.stringify(q.paging)));
		}

		qs = _util.addToString(qs, '&', END_OF_QUERY_MARKER);

		return qs;
	}

	public static fromQueryString(qs: string): SearchRequest {
		let request = new SearchRequest();
		const params = _util.getQueryParams(qs);
		if (_util.isObject(params) && params.hasOwnProperty(END_OF_QUERY_MARKER)) {
			const q = request = <SearchRequest> {
				query: <SearchModel> JSON.parse(decodeURIComponent(params['q']))
			};
			if (!_util.isEmpty(params['pf'])) {
				q.facetsFilters = JSON.parse(params['pf']);
			}
			if (!_util.isEmpty(params['op'])) {
				q.options = JSON.parse(params['op']);
			}
			if (!_util.isEmpty(params['pa'])) {
				q.paging = JSON.parse(params['pa']);
			}
		}
		return _util.isObject(request.query) ? request : undefined;
	}
}
