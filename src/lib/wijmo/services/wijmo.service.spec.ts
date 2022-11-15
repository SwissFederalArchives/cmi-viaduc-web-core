import {WijmoService} from './wijmo.service';

describe('WijmoService', () => {
	let sut: WijmoService;
	let result = '';

	beforeEach(() => {
		sut = new WijmoService();

	});

	it(` special characters is not removed`, () => {
		let test = '!Pet$€#';
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual('!Pet$€#');
	});

	it(` special character STX is removed `, () => {
		let test =  String.fromCharCode(2) + '!Pet$€#';
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual('!Pet$€#');
	});

	it(` special character Ascii Code 2-6 is removed `, () => {
		let test =  String.fromCharCode(2) + '!P' + String.fromCharCode(3)
			+ 'et$€#' + String.fromCharCode(4) + String.fromCharCode(5)  + String.fromCharCode(6);
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual('!Pet$€#');
	});

	it(`String.fromCharCode(7)' is removed`, () => {
		let test = '=&nbsp' + String.fromCharCode(7);
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual('\'=&nbsp');
	});

	it(`blanks are not removed`, () => {
		let test = 'Test 12 3';
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual('Test 12 3');
	});

	it(`correct string remains as it is`, () => {
		let test = 'Test85Klaus';
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual('Test85Klaus');
	});

	it(`Text with valid and invalid special characters`, () => {
		let test = `Dies ist
ein Text mit Zeilenumbrüchen
und \t Tab mit  anderen Spezialzeichen  aus den tiefen Ascii Bereichen
ª┼😀😎ກປか alles gültige Zeichen
und dieses unsichtbare \f Formfeed sollte gelöscht werden.`;
		let expected =   `Dies ist
ein Text mit Zeilenumbrüchen
und \t Tab mit  anderen Spezialzeichen  aus den tiefen Ascii Bereichen
ª┼😀😎ກປか alles gültige Zeichen
und dieses unsichtbare  Formfeed sollte gelöscht werden.`;
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual(expected);
	});

	it(`String with assci Code 0 to 8, all removed`, () => {
		let test =   String.fromCharCode(0, 1, 2, 3, 4, 5, 6, 7, 8);
		result = sut.replaceExcelCorruptionChars(test);
		expect(result).toEqual('');
	});
});
