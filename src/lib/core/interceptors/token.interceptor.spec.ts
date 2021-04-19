import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {TokenInterceptor} from './token.interceptor';
import {Session} from '../model/session';
import {ClientContext} from '../services/clientContext';
import {ClientModel} from '../services/clientModel';

describe('AuthorizationInterceptor', () => {
	let clientContext = new ClientContext(new ClientModel());
	let token;

	beforeEach(() => {
		token = 'abc';
		clientContext.currentSession = <Session>{token: token};

		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
				{ provide: ClientContext, useFactory: () => clientContext }
			],
		});
	});

	describe('intercept', () => {
		it('should set authorization header if session has an auth token set',
			inject([HttpClient, HttpTestingController], (httpClient: HttpClient, httpMock: HttpTestingController) => {
				const requestUrl = 'http://demo.ch/api/entities';

				httpClient
					.get(requestUrl)
					.subscribe();

				const req = httpMock.expectOne(requestUrl);

				expect(req.request.headers.has('Authorization')).toBe(true);
				expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
			}));

		it('should skip authorization header without an auth token in session set',
			inject([HttpClient, HttpTestingController], (httpClient: HttpClient, httpMock: HttpTestingController) => {
				const requestUrl = 'http://demo.ch/api/entities';
				clientContext.currentSession.token = undefined;

				httpClient
					.get(requestUrl)
					.subscribe();

				const req = httpMock.expectOne(requestUrl);

				expect(req.request.headers.has('Authorization')).toBe(false);
			}));
	});
});
