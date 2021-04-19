import {Paging} from '../paging';
import {Entity} from './entity';

export interface EntitiesResult {
	items: Entity[];
	paging: Paging;
}
