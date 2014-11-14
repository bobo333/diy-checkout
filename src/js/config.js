// Checkout configuration

define(function(require) {
  return {
    // For testing on sandbox
    // apiHost: 'https://api-sandbox.trycelery.com',
    apiHost: '<%= ENV["CELERY_API"] %>',
    // slug: '53ebdd5e1fd9c90400553dab',
    features: {
      taxes: true,
      coupons: false
    }
  };
});