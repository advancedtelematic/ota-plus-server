function defineTheme() {
    var storedThemeMode = localStorage.getItem('themeMode');
    var theme = 'atsgarage';
    switch(storedThemeMode) {
        case 'otaplus': 
            theme = 'otaplus';
        break;
        default:
        break;
    }
    
    return theme;
}