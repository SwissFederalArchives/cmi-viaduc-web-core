import {TranslationService} from './translation.service';
import {ClientContext} from './clientContext';
import {PreloadService} from './preload.service';
import {CoreOptions} from './coreOptions';

describe('TranslationService', () => {
	let sut: TranslationService;
	let preloadService: PreloadService;
	let context: ClientContext;
	let defaultLanguage = 'en';

	const coreOptions = <CoreOptions>{
		serverUrl: 'api'
	};

	const translations = {
		language: defaultLanguage,
		translations: {
			'_': {
				'USS Enterprise': 'NCC-1701'
			},
			'Ship': {
				'Enterprise': 'NCC-1701'
			}
		}
	};

	describe('translate', () => {

		beforeEach(() => {
			preloadService = new PreloadService(coreOptions, null);
			preloadService.translationsByLanguage[defaultLanguage] = translations;
			context = <ClientContext>{defaultLanguage: defaultLanguage, language: defaultLanguage};
			sut = new TranslationService(context, preloadService);
			sut.showMissingInfo = false;
		});

		it('should translate text using given translations', () => {
			const result = sut.translate('USS Enterprise');

			expect(result).toBe('NCC-1701');
		});

		it('should return text if translations does not contain text', () => {
			const name = 'USS Voyager';

			const result = sut.translate(name);

			expect(result).toBe(name);
		});

		it('should add missing info if translations does not contain text', () => {
			const ctx = <ClientContext>{defaultLanguage: defaultLanguage, language: 'de'};
			const txt = new TranslationService(ctx, preloadService);
			const name = 'USS Voyager';

			txt.showMissingInfo = true;
			const result = txt.translate(name);

			expect(result).toBe(txt.getMissingInfo(ctx.language, name));
		});

		it('should not add missing info for default language if translations does not contain text', () => {
			const name = 'USS Voyager';

			sut.showMissingInfo = true;
			const result = sut.translate(name);

			expect(result).toBe(name);
		});

		it('should return text if translations do not contain it', () => {
			const result = sut.translate('USS Defiant');

			expect(result).toBe('USS Defiant');
		});

		it('should return text if no translations were given', () => {
			const txt = new TranslationService(context, preloadService);

			const result = txt.translate('USS Franklin');

			expect(result).toBe('USS Franklin');
		});

	});
});
