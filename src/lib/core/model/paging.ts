export interface Paging {
	skip?: number;
	take?: number;

	orderBy?: string;
	sortOrder?: string;

	total?: number;
}
