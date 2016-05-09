define(function(require) {
  
  var React = require('react'),
      enFile = require('../../i18n/en'),
      deFile = require('../../i18n/de'),
      jpFile = require('../../i18n/jp');
      
  const languages = {
    en: enTranslations,
    de: deTranslations,
    jp: jpTranslations,
  };
  
  var Translate = function Translate(Component) {
    return class TranslateClass extends React.Component {  
      render() {
        var lang = 'en';
        if(localStorage.getItem('currentLang') && localStorage.getItem('currentLang') in languages) {
          lang = localStorage.getItem('currentLang');
        } else {
            var browserLang = (navigator.language || navigator.userLanguage);  
            if(browserLang && browserLang in languages) {
              lang = browserLang;
            }
        }
                
        var strings = languages[lang];          
        return (
  	  <Component {...this.props} {...this.state} strings={strings} />
	);
      }
    }
  };
  
  return Translate;
});
