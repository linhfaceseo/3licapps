import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

import en from './en';

i18n.locale = RNLanguages.language;

// Test
//i18n.locale='cn';

i18n.fallbacks = true;
i18n.translations = { en };

export default i18n;