$(function () {
  $('#ats-page').fadeIn('slow');

  var lock = new Auth0Lock($('#auth0-client-id').val(), $('#auth0-domain').val());
  lock.on("authorization_error", function (err) {
    alert(err);
  });

  lock.show({
    callbackURL: $('#auth0-callback-url').val(),
    container: 'widget-container',
    authParams: {
      scope: 'openid email'
    },
    dict: {
      signin: {
        title: "Login to ATS Garage.",
        action: "Login",
        forgotText: "Forgot Password >",
        separatorText: "Or use an existing account:",
        signupText: "Not registered yet? Sign up here.",
        signinText: "Already registered? Login here."
      },
      signup: {
        title: "Get started with ATS Garage.",
        action: "Start now!",
        signupText: "Not registered yet? Sign up here.",
        signinText: "Already registered? Login here."
      },
      newReset: {
        headerText: "Please enter your email address. We will send you a link to reset your password."
      }
    }
  });

  lock.on('ready', function () {
    var appUrl = location.protocol + '//' + location.host;
    $(".a0-image").append('<img src="' + appUrl + '/assets/img/ATS-Garage_Logo_white.svg" alt="">');
  });
  lock.on('signin ready', function () {
    $(".a0-forgot-pass").detach().appendTo('.bottom-content');
  });
  lock.on('signup ready', function () {
    var link = $("<div class='terms-conditions'>By registering I agree to <a href='http://atsgarage.com/en/terms-conditions.html' target='_blank'>ATS Garage's Terms of Use.</a></div>");
    if(!$('.terms-conditions').length)
      link.appendTo('.bottom-content');
  });
});
