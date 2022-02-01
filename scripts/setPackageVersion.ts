import {readFileSync, writeFileSync} from 'fs';
import {getProjectVersion} from './getProjectVersion';

async function main() {
	getProjectVersion().then(version => {

		if (process.argv.includes('--release')) {
			version = version.split('-')[0];
		}

		setVersion('./src/package.json', version);
		setVersion('./src/package-lock.json', version);
	})
	.catch(e => {
		console.error(e);
	});
}

function setVersion(name: string, version: string) {
	const packageObject = JSON.parse(readFileSync(name, 'utf8'));
	packageObject.version = version;
	writeFileSync(name, JSON.stringify(packageObject, undefined, 2));
	console.log(`Set package version in file ${name} to ${version}.`);
}

main().catch((e) => {
	console.error(e);
	process.exitCode = 1;
});
