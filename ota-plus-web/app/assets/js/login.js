$(function () {
  $('#ats-page').fadeIn('slow');

  var appUrl = location.protocol + '//' + location.host;
  var logoUrl = appUrl + '/assets/img/ATS-Garage_Logo_white.svg';
  var options = {
    oidcConformant: true,
    theme: {
      logo: logoUrl
    },
    socialButtonStyle: 'small',
    auth: {
      redirectUrl: $('#auth0-callback-url').val(),
      audience: "KSjTVr20nLwDtCiRAmJCjNyfmr20YK6J",
      params: {
        scope: 'openid profile email'
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

 lock.on('signin ready', function () {
   $('.auth0-lock').addClass('signin');
   $('.auth0-lock').removeClass('signup');

   $('input.auth0-lock-input[name="email"]').attr('id','a0-signin_easy_email');
   $('input.auth0-lock-input[name="password"]').attr('id','a0-signin_easy_password');

   if($('.terms-conditions').length) {
    $('.terms-conditions').remove();
   }
 });
 lock.on('signup ready', function () {
   $('.auth0-lock').removeClass('signin');
   $('.auth0-lock').addClass('signup');

   $('input.auth0-lock-input[name="email"]').attr('id','a0-signup_easy_email');
   $('input.auth0-lock-input[name="password"]').attr('id','a0-signup_easy_password');

   var link = $("<div class='terms-conditions'>By registering I agree to <a href='http://atsgarage.com/en/terms-conditions.html' target='_blank'>ATS Garage's Terms of Use.</a></div>");
   if(!$('.terms-conditions').length)
     link.appendTo('.auth0-lock-center');
 });
  lock.on('forgot_password ready', function () {

    $('input.auth0-lock-input[name="email"]').attr('id','a0-reset_easy_email');

  });
});
