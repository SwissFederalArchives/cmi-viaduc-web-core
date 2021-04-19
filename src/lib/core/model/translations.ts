export const DEFAULT_LANGUAGE = 'de';

export type Language = {
	key: string,
	short: string,
	name: string,
};

export type Translations = {
	language: string;
	translations: { [key: string]: any };
};
