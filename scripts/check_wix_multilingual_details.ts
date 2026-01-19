
import { translationContents, locales } from '@wix/multilingual';

console.log('Keys of translationContents:');
console.log(Object.keys(translationContents || {}));

console.log('Keys of locales:');
console.log(Object.keys(locales || {}));
