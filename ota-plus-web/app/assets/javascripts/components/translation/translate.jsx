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
    var TranslateClass = class TranslateClass extends React.Component {  
      getChildContext() {
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
        return { 
          strings: strings
        };
      }
      render() {  
        return (
  	  <Component />
	);
      }
    }
    
    TranslateClass.childContextTypes = {
      strings: React.PropTypes.object.isRequired
    };
    
    return TranslateClass;
  };
  
  return Translate;
});
