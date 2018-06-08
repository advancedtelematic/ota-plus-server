$(function () {
  $('#ats-page').fadeIn('slow');

  var appUrl = location.protocol + '//' + location.host;
  var logoUrl = appUrl + '/assets/img/HERE_pos.png';
  var options = {
    oidcConformant: true,
    allowSignUp: false,
    theme: {
      logo: logoUrl
    },
    socialButtonStyle: 'small',
    auth: {
      redirectUrl: $('#auth0-callback-url').val(),
      audience: $('#auth0-token-audience').val(),
      params: {
        scope: 'openid profile email'
      }
    },
    container: 'widget-container',
    languageDictionary: {
      title: "Get more from HERE",
      loginSubmitLabel: "Sign in",
      socialLoginInstructions: "ATS Garage is now HERE OTA Connect...",
      databaseEnterpriseAlternativeLoginInstructions: "Sign in to your HERE account",
      forgotPasswordAction: "Forgot your password?",
      forgotPasswordTitle: 'Password reset',
      forgotPasswordInstructions: "Please enter your email address. We will send you a link to reset your password.",
      forgotPasswordSubmitLabel: "Send",
    }
  }

  var lock = new Auth0Lock($('#auth0-client-id').val(), $('#auth0-domain').val(), options);

  lock.on("authorization_error", function (err) {
    alert(err);
  });

 lock.show(options);

 lock.on('signin ready', function() {
  var registerLink = "<a href='https://developer.here.com/authenticationpage' class='auth0-register-link'>Register for a HERE account</a>";
  if(!$('.auth0-register-link').length) {
    $('.auth0-lock-header-welcome').append(registerLink);
  }
 });
});
