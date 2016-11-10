/*!
 * verify.js
 * Author: ATS
 */
(function ($, window, document, undefined) {
    var pluginName = "verify",
            defaults = {
                verifyModalId: 'verifyModal',
                verifyHeaderText: 'Tip!',
                verifyBodyText: 'ATS Garage works best in a browser window that is at least <strong>1280 x 768</strong>. You can still use it at a smaller size, but we recommend using a desktop browser for the best experience.',
                verifyMinWidth: 1024,
                verifyMinHeight: 768,
                cookieKey: 'dontShowVerifyModal'
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
            var cookieKey = this.options.cookieKey;
            
            function toggleModal(verifyModalId, minWidth, minHeight) {
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var cookieVal = getCookie() === 'true' ? true : false;

                if (!cookieVal && (windowWidth < minWidth || windowHeight < minHeight)) {
                    $('#' + verifyModalId).modal();
                } else {
                    $('#' + verifyModalId).modal('hide');
                }
            }
            
            function setCookie(value) {
                var expires = new Date();
                expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
                document.cookie = cookieKey + '=' + value + ';expires=' + expires.toUTCString();
            }
            
            function getCookie() {
                var keyValue = document.cookie.match('(^|;) ?' + cookieKey + '=([^;]*)(;|$)');
                return keyValue ? keyValue[2] : null;
            }

            this.$elem.after('<div id=' + verifyModalId + ' class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"><i class="fa fa-lightbulb-o" aria-hidden="true"></i> ' + this.options.verifyHeaderText + ' </div><div class="modal-body"> ' + this.options.verifyBodyText + ' </div><div class="modal-footer"><div class="margin-top-10 pull-left"><input type="checkbox" name="verify_modal_dismiss" /> ' +  "Don't" + ' show this again</div> <div class="pull-right"><button type="button" id="close-verify-modal" class="btn btn-confirm" aria-label="Close">OK</button></div></div></div></div></div></div>');
            
            toggleModal(verifyModalId, verifyMinWidth, verifyMinHeight);

            $(window).resize(function () {
                toggleModal(verifyModalId, verifyMinWidth, verifyMinHeight);
            });
            
            $('#close-verify-modal').click(function() {
                var dontShowAgain = $('input[name="verify_modal_dismiss"]').prop('checked');
                if(dontShowAgain) {
                  setCookie(true);
                }
                $('#' + verifyModalId).modal('hide');
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


