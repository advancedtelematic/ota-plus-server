/*!
 * verify.js
 * Author: ATS
 */
(function ($, window, document, undefined) {
    var pluginName = "verify",
            defaults = {
                verifyModalId: 'verifyModal',
                verifyHeaderText: 'Unsupported screen size',
                verifyBodyText: 'Sorry, but your screen size is not supported in ATS Garage.',
                verifyMinWidth: 1024,
                verifyMinHeight: 768
            };

    function Plugin(element, options) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var verifyModalId = this.options.verifyModalId;
            var verifyMinWidth = this.options.verifyMinWidth;
            var verifyMinHeight = this.options.verifyMinHeight;
            
            function toggleModal(verifyModalId, minWidth, minHeight) {
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();

                if (windowWidth < minWidth || windowHeight < minHeight) {
                    $('#' + verifyModalId).modal({backdrop: 'static'});
                } else {
                    $('#' + verifyModalId).modal('hide');
                }
            }

            this.$elem.after('<div id=' + verifyModalId + ' class="modal fade" role="dialog"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"><i class="fa fa-warning"></i> ' + this.options.verifyHeaderText + ' </div><div class="modal-body"><p> ' + this.options.verifyBodyText + ' </div></div></div></div>');
            
            toggleModal(verifyModalId, verifyMinWidth, verifyMinHeight);

            $(window).resize(function () {
                toggleModal(verifyModalId, verifyMinWidth, verifyMinHeight);
            });
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);


