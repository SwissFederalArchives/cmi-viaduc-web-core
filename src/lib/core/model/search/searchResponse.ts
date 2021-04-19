import {Entity} from '../entity/entity';
import {Paging} from '../paging';

export interface EntityResult {
	items: Entity[];
	paging: Paging;
}

export interface Facet {
	aggregations: Aggregation[];
	items: AggregationEntry[];
	sumOtherDocCount: number;
}

export interface Aggregation {
	items: AggregationEntry[];
}

export interface AggregationEntry {
	key: string;
	keyAsString: string;
	filter: string;
	docCount: number;
	active: false;
}

export type SearchResponse = {
	entities: EntityResult,
	facets: Facet[],
	enableExplanations: boolean,
};

export interface SearchError {
	error: InnerError;
}

export interface InnerError {
	statusCode: number;
	identifier: string;
	message: string;
	details: string;
}

export enum FacetteAction {
	Add,
	Remove,
}

export class FacetteFilterItem {
	public facette: Facet;
	public key: string;
	public chosenFilter: AggregationEntry;
	public action: FacetteAction = FacetteAction.Add;
}
