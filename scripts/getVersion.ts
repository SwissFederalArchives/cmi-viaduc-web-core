import {getProjectVersion} from './getProjectVersion';

getProjectVersion().then(v => console.log(v)).catch(e => {
	console.error(e);
	process.exitCode = 1;
});
