import {AutoSizeDirective} from './autoSize.directive';
import {AutoFocusDirective} from './autoFocus.directive';
import {CopyClipboardDirective} from './clipboard.directive';

export const ALL_DIRECTIVES = [
	AutoFocusDirective,
	AutoSizeDirective,
	CopyClipboardDirective,
];

export * from './autoFocus.directive';
export * from './autoSize.directive';
export * from '../includes/utilities';
