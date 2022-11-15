export interface Session {
	userid: string;
	userExtId: string;
	username: string;
	lastname: string;
	firstname: string;
	emailaddress: string;
	isKerberosAuthentication: boolean;

	authenticated: boolean;
	inited: number;

	roles: { [key: string]: boolean; };
	accessTokens: { [key: string]: boolean; };
	applicationRoles: { [key: string]: boolean; };
	applicationFeatures: { [key: string]: boolean; };

	authenticationRoles: { [key: string]: string; };
	authorizationFeatures: { [key: string]: string; };
}
