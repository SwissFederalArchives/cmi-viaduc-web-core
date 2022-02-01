import {HttpService} from './http.service';
import {CookieService} from './cookie.service';
import {LocalStorageService} from './localStorage.service';
import {TranslationService} from './translation.service';
import {ConfigService} from './config.service';
import {PreloadService} from './preload.service';
import {ReCaptchaService} from './reCaptcha.service';
import {UiService} from './ui.service';
import {EntityDecoratorService} from './entityDecorator.service';
import {StammdatenService} from './stammdaten.service';
import {CountriesService} from './countries.service';
import {FileSaverService} from './fileSaver.service';
export const ALL_SERVICES = [
	HttpService,
	CookieService,
	ConfigService,
	PreloadService,
	ReCaptchaService,
	LocalStorageService,
	TranslationService,
	UiService,
	FileSaverService,
	EntityDecoratorService,
	StammdatenService,
	CountriesService
];
