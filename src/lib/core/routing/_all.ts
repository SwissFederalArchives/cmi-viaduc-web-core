// Resolvers
import {CountriesResolver} from './countriesResolver';
import {CanDeactivateGuard} from './canDeactivate.guard';

export const ALL_RESOLVERS = [
	CountriesResolver,
	CanDeactivateGuard
];
