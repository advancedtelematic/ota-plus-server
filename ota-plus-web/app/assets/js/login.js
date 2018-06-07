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
      audience: $('#auth0-token-audience').val(),
      params: {
        scope: 'openid profile email'
      }
    },
    container: 'widget-container',
    languageDictionary: {
      title: "Login to ATS Garage.",
      signupTitle: "Register to ATS Garage.",
      loginLabel: "Already registered? Login here.",
      loginSubmitLabel: "Login",
      forgotPasswordTitle: 'Password reset',
      forgotPasswordAction: "Forgot Password >",
      forgotPasswordInstructions: "Please enter your email address. We will send you a link to reset your password.",
      forgotPasswordSubmitLabel: "Send",
      signUpLabel: 'Not registered yet? Sign up here.',
      signUpSubmitLabel: 'Start now!'
    },
    signUpLink: $('#auth0-sign-up-url').val()
  }

  var lock = new Auth0Lock($('#auth0-client-id').val(), $('#auth0-domain').val(), options);

  lock.on("authorization_error", function (err) {
    alert(err);
  });

  lock.show();

 lock.on('signin ready', function () {
   $('.auth0-lock').addClass('signin');
   $('.auth0-lock').removeClass('signup');

   $('.auth0-lock-name').text(options.languageDictionary.title);

   $('input.auth0-lock-input[name="email"]').attr('id','a0-signin_easy_email');
   $('input.auth0-lock-input[name="password"]').attr('id','a0-signin_easy_password');
   $('.auth0-lock-form .auth0-lock-tabs-current + li > a').attr('id','login-signup-switch');
   $('.auth0-lock-alternative > a').attr('id','forgot_password_link');
   $('.auth0-lock-social-button[data-provider="github"]').attr('id','github_social_link');
   $('.auth0-lock-social-button[data-provider="google-oauth2"]').attr('id','google_social_link');

   if($('.terms-conditions').length) {
    $('.terms-conditions').remove();
   }
 });
 lock.on('signup ready', function () {
   $('.auth0-lock').removeClass('signin');
   $('.auth0-lock').addClass('signup');

   $('.auth0-lock-name').text(options.languageDictionary.signupTitle);

   $('input.auth0-lock-input[name="email"]').attr('id','a0-signup_easy_email');
   $('input.auth0-lock-input[name="password"]').attr('id','a0-signup_easy_password');
   $('.auth0-lock-form .auth0-lock-tabs li:not(.auth0-lock-tabs-current) > a').attr('id','login-signup-switch');
   $('.auth0-lock-social-button[data-provider="github"]').attr('id','github_social_link');
   $('.auth0-lock-social-button[data-provider="google-oauth2"]').attr('id','google_social_link');
   
   var link = $("<div class='terms-conditions'>By registering I agree to <a href='http://atsgarage.com/en/terms-conditions.html' target='_blank'>ATS Garage's Terms of Use.</a></div>");
   if(!$('.terms-conditions').length)
     link.appendTo('.auth0-lock-center');
 });
  lock.on('forgot_password ready', function () {

    $('input.auth0-lock-input[name="email"]').attr('id','a0-reset_easy_email');

  });
});
