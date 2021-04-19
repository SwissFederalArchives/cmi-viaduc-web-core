import {getVersion} from 'nerdbank-gitversioning';

export async function getProjectVersion(path?: string) {
	// NOTE: According to the semver specification (https://semver.org/#spec-item-9, see point 9.), identifiers after the dash cannot have
	// leading zeroes. Since a commit hash can have leading zeroes, we insert "beta-" to make sure it doesn't.
	return (await getVersion(path)).npmPackageVersion.replace('-', '-beta-');
}
