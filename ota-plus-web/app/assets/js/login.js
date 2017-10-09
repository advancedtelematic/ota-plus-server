$(function () {
  $('#ats-page').fadeIn('slow');

  var appUrl = location.protocol + '//' + location.host;
  var logoUrl = appUrl + '/assets/img/ATS-Garage_Logo_white.svg';
  var options = {
    theme: {
      logo: logoUrl
    },
    socialButtonStyle: 'small',
    auth: {
      redirectUrl: $('#auth0-callback-url').val(),
      params: {
        scope: 'openid email'
      }
    },
    container: 'widget-container',
    languageDictionary: {
      title: "Login to ATS Garage.",
      signupTitle: "Get started with ATS Garage.",
      loginLabel: "Already registered? Login here.",
      loginSubmitLabel: "Login",
      forgotPasswordTitle: 'Password reset',
      forgotPasswordAction: "Forgot Password >",
      forgotPasswordInstructions: "Please enter your email address. We will send you a link to reset your password.",
      forgotPasswordSubmitLabel: "Send",
      socialLoginInstructions: 'Or use an existing account:',
      signUpLabel: 'Not registered yet? Sign up here.',
      signUpSubmitLabel: 'Start now!'
    }
  }

  var lock = new Auth0Lock($('#auth0-client-id').val(), $('#auth0-domain').val(), options);

  lock.on("authorization_error", function (err) {
    alert(err);
  });

  lock.show();

//  lock.on('ready', function () {
//    var appUrl = location.protocol + '//' + location.host;
//    $(".a0-image").append('<img src="' + appUrl + '/assets/img/ATS-Garage_Logo_white.svg" alt="">');
//  });
//  lock.on('signin ready', function () {
//    $(".a0-forgot-pass").detach().appendTo('.bottom-content');
//  });
//  lock.on('signup ready', function () {
//    var link = $("<div class='terms-conditions'>By registering I agree to <a href='http://atsgarage.com/en/terms-conditions.html' target='_blank'>ATS Garage's Terms of Use.</a></div>");
//    if(!$('.terms-conditions').length)
//      link.appendTo('.bottom-content');
//  });
});
