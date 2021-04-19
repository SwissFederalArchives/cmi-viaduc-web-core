import {Entity} from './entity';

export interface EntityContext {
	ancestors: Entity[];
	children: Entity[];
	depth?: number;
	id?: string;
	title?: string;
}
