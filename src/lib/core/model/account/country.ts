export class Country {
	constructor(public code: string,
		public name: string,
		public canOnboardWithPassport: boolean = true,
		public canOnboardWithIdentityCard: boolean = true,
		public newLaenderCode: string) {
	}
}

export type Countries = Country[];
