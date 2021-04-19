import {TranslatePipe} from './translate.pipe';
import {Translations} from '../model';
import { ClientContext, TranslationService, PreloadService, CoreOptions } from '../services/public_api';
import { ClientModel } from '../services/clientModel';

describe('TranslatePipe', () => {
	let sut: TranslatePipe;
	let translationService: TranslationService;
	let preloadService: PreloadService;

	const coreOptions = <CoreOptions>{
		serverUrl: 'api'
	};

	beforeEach(() => {

		preloadService = new PreloadService(coreOptions, null);
		preloadService.translationsByLanguage['de'] = <Translations>{
			language: 'de',
			translations: {
				'_': {
					'Falcon': 'Falke'
				},
				'StarWars': {
					'ShipOfHanSolo': 'Millenium Falke'
				}
			}
		};

		translationService = new TranslationService(new ClientContext(new ClientModel()), preloadService);
		sut = new TranslatePipe(translationService);

		spyOn(translationService, 'translate').and.callThrough();
	});

	describe('transform', () => {
		it('should return translation default from translation service', () => {
			const text = 'Falcon';
			const result = sut.transform(text);

			expect(result).toBe('Falke');
			expect(translationService.translate).toHaveBeenCalledWith(text, undefined, []);
		});

		it('should return translation by key from translation service', () => {
			const key = 'StarWars.ShipOfHanSolo';
			const text = 'Millenium Falcon';

			const result = sut.transform(text, key);

			expect(result).toBe('Millenium Falke');
			expect(translationService.translate).toHaveBeenCalledWith(text, key, []);
		});

		it('should return text if translation by key is not found by translation service', () => {
			const key = 'StarWars.ShipOfHansSolo';
			const text = 'Millenium Falcon';

			const result = sut.transform(text, key);

			expect(result).toBe(text);
			expect(translationService.translate).toHaveBeenCalledWith(text, key, []);
		});

	});
});
