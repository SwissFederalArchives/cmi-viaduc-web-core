import {AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {TranslationService} from '../services/translation.service';
import * as moment_ from 'moment';
const moment = moment_;
import * as Pikaday from 'pikaday';
import {NgControl} from '@angular/forms';
import {Moment} from 'moment';

@Directive({
	selector: '[datePicker]'
})
export class DatePickerDirective implements OnInit, AfterViewInit {

	private _htmlElement: HTMLElement;
	private _picker: Pikaday;
	private _placeholder: string;
	private _openingDays: Moment[];
	private _isSetting = false;

	@Input('openingDays')
	public set openingDays(days: string[]) {
		this._openingDays = days.map(d => moment(d, 'DD.MM.YYYY'));
	}

	@Input('minDateToday')
	public minDateToday: boolean = true;

	@Input('minDate')
	public minDate: Date = null;

	@Output('isValidChanged')
	public isValidChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private _elementRef: ElementRef,
				private _txt: TranslationService,
				private _control: NgControl) {
		this._htmlElement = this._elementRef.nativeElement;
	}

	public ngOnInit(): void {
		this._placeholder = this._txt.get('calendar.placeHolder', 'Bitte wählen Sie ein Datum aus');
		this._htmlElement.setAttribute('placeholder', this._placeholder);
	}

	public ngAfterViewInit() {
		let days = this._txt.get('calendar.days.short', 'So;Mo;Di;Mi;Do;Fr;Sa').split(';');
		let weekdays = this._txt.get('calendar.days.week', 'Sonntag;Montag;Dienstag;Mittwoch;Donnerstag;Freitag;Samstag;Sonntag').split(';');
		let months = this._txt.get('calendar.months', 'Januar;Februar;März;April;Mai;Juni;Juli;August;September;Oktober;November;Dezember').split(';');

		if (this._control) {
			this._control.control.valueChanges.subscribe(value => {
				if (value) {
					const isValid = this.isValidDate(value);
					if (isValid && !this._isSetting) {
						this._isSetting = true;
						this._picker.setMoment(moment(value, ['D.M.YY', 'D.M.YYYY'], 'de', true));
						this._isSetting = false;
					}
					this.isValidChanged.emit(isValid);
				} else {
					this.isValidChanged.emit(true);
				}
			});
		}

		// must be a input[type=text] to change the format
		this._htmlElement.setAttribute('type', 'text');
		this._picker = new Pikaday({
			field: this._htmlElement,
			format: 'D.M.YY', // allowing 5.3.2017 or 05.03.2017 or 5.3.18;
			formatStrict: true,
			minDate: this.minDateToday ? new Date() : this.minDate ? this.minDate : null,
			firstDay: 1, // sets monday as first day,
			onSelect: () => {
				if (this._control) {
					this._control.control.setValue(this._picker.getMoment().format('DD.MM.YYYY'));
				} else {
					this._elementRef.nativeElement.value = this._picker.getMoment().format('DD.MM.YYYY');
				}
			},
			disableDayFn: (date) => {
				if (this._openingDays && this._openingDays.length > 0 && this._openingDays.filter(m => m.isSame(moment(date), 'day')).length === 0) {
					return date;
				}
			},
			theme: 'admin-theme',
			i18n: {
				previousMonth: this._txt.get('calendar.month.previous', 'Vorheriger Monat'),
				nextMonth: this._txt.get('calendar.month.next', 'Nächster Monat'),
				months: months,
				weekdays: weekdays,
				weekdaysShort: days,
			}
		});
	}

	@HostListener('click', ['$event'])
	public onClick() {
		this._picker.show();
	}

	@HostListener('blur', ['$event'])
	public onBlur() {
		this._picker.hide();
	}

	@HostListener('focusout', ['$event'])
	public onFocusout() {
		if (this._control) {
			this.ensureCorrectFormatting(this._control.control.value);
		}
	}

	private ensureCorrectFormatting(value: string) {
		if (value) {
			const dateString = moment(value, ['D.M.YY', 'D.M.YYYY'], 'de', true).format('DD.MM.YYYY');
			if (value !== dateString && this.isValidDate(value)) {
				if (this._control) {
					this._control.control.setValue(dateString, {emitEvent: false});
				} else {
					this._elementRef.nativeElement.value = dateString;
				}
			}
		}
	}

	private isValidDate(value: string): boolean {
		if (!!value.match(`^((\\d\\d|\\d)\\.){2}\\d{4}$`)) {
			return moment(value, ['D.M.YY', 'D.M.YYYY'], 'de', true).isValid();
		}
		return false;
	}
}
