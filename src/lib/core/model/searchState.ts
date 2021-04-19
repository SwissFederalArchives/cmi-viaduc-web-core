import {SearchRequest} from './search/searchRequest';
import {EntityResult, SearchError} from './search/searchResponse';
import {SearchBrowseState} from './searchBrowseState';

export class SearchState {
	public request: SearchRequest;
	public result: EntityResult;
	public error: SearchError;
	public browse: SearchBrowseState;
	public advancedSearch: boolean = false;
}
