define(function(require, exports, module) {
  // Shim to avoid requiring Velocity in Node environments, since it
  // requires window. Note that this just no-ops the components so
  // that they'll render, rather than doing something clever like
  // statically rendering the end state of any provided animations.
  if (typeof window !== 'undefined') {
    // this is how velocity-ui finds the Velocity instance, so lets make sure we find the right instance
    var g = (window.jQuery || window.Zepto || window);
    // require Velocity if it doesn't already exist
    module.exports = g.Velocity ? g.Velocity : require('velocity');
  } else {
    var Velocity = function () {};
    Velocity.velocityReactServerShim = true;
    module.exports = Velocity;
  }
});