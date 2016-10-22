(function () {
    this.LoadingTexts = function () {
        this.options = {
            interval: '2000',
            texts: [
                'Turning on the lights',
                'Checking for available repair bays',
                'Activating hydraulics',
                'Calibrating differential gears',
                'Calibrating integral gears',
                'Calibrating algebraic gears',
                'Calibrating non-Euclidian gears',
                'Falling back to standard geometries',
                'Aligning the turbo-encabulators',
                'Waking up the valet'
            ]
        };

        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(this.options, arguments[0]);
        }

        var wrapper = document.getElementById(this.options.wrapper);
        var textsArray = shuffle(this.options.texts);
        var curIndex = 1;

        wrapper.innerHTML = '<span class="counting">' + textsArray[0] + '</span>';

        var intervalId = setInterval(function () {
            if (curIndex === textsArray.length) {
                clearInterval(intervalId);
            }
            wrapper.innerHTML = '<span class="counting">' + textsArray[curIndex] + '</span>';
            curIndex++;
        }, this.options.interval);
    };

    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
})();