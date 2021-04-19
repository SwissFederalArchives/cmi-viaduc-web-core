import {of} from 'rxjs';
import {HttpService} from './http.service';
import {HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

describe('HttpService', () => {
	let sut: HttpService;

	let http: HttpClient;
	let response: any;
	let url: string;
	let body: any;
	let httpEvent: HttpEvent<any>;

	beforeEach(() => {
		body = {};
		response = <any>{};
		httpEvent = <HttpEvent<any>> { type : HttpEventType.DownloadProgress };

		http = <any>{
			get: u => of(response),
			post: (u, b) => of(response),
			request: (u, p) => of(httpEvent)
		};

		url = 'http://localhost/';
		sut = new HttpService(http);

		spyOn(http, 'get').and.callThrough();
		spyOn(http, 'post').and.callThrough();
		spyOn(http, 'request').and.callThrough();
	});

	describe('get', () => {
		it('should use the provided url to call get on Http', () => {
			sut.get<any>(url);
			expect(http.get).toHaveBeenCalledWith(url);
		});

		it('should return the expected response', done => {
			sut.get<any>(url).subscribe(res => {
				expect(res).toBe(response);
				done();
			});
		});
	});

	describe('download', () => {
		it('should use the provided url to call get on Http', () => {
			sut.download(url);
			expect(http.request).toHaveBeenCalled();
		});

		it('should return the expected response', done => {
			sut.download(url).subscribe(res => {
				expect(res).toBe(httpEvent);
				done();
			});
		});
	});

	describe('post', () => {
		it('should use the provided url to call get on Http', () => {
			body = {};

			sut.post<any>(url, body);

			expect(http.post).toHaveBeenCalledWith(url, body);
		});

		it('should return the expected response', done => {
			sut.post<any>(url, body).subscribe(res => {
				expect(res).toBe(response);
				done();
			});
		});
	});
});
