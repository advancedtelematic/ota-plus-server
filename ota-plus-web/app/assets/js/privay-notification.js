$(function () {
  $('#ats-page').on('click', function() {
    $('.privay-notification .text').hide();
    $('.privay-notification .fa-angle-up').hide();
    $('.privay-notification .fa-angle-down').show();
  });

  $('.privay-notification').on('click', function(e) {
    e.stopPropagation();
    $('.privay-notification .text').show();
    $('.privay-notification .fa-angle-down').hide();
    $('.privay-notification .fa-angle-up').show();
  });
});
