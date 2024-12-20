import { Oauth2Provider } from '../auth.ts';

export class CognitoOauth2Provider implements Oauth2Provider {
	constructor() {
		console.log('CognitoOauth2Provider');
	}
}