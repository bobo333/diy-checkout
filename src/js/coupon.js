define(function(require) {
  var celeryClient = require('celery_client');

  return {
    // Coupon adds a discount
    validate: function(code, cb) {
      if (!code) {
        return cb(true);
      }

      code = code.toLowerCase();

      // Cache hit
      if (this.data[this._getCouponIdentifier(code)] !== undefined) {
        var coupon = this.data[this._getCouponIdentifier(code)];

        // Invalid
        if (coupon === false) {
          return cb(false);
        }

        // Valid
        return cb(true);
      }

      // Code not found, fetch and try again
      this.fetch(code, function(err, data) {
        this.validate(code, cb);
      });
    },

    fetch: function(code, cb) {
      return celeryClient.fetchCoupon({
        code: code
      }, $.proxy(function(err, data) {
        // Cache result
        if (err || !data || !data.data || data.data.code === undefined) {
          this.data[this._getCouponIdentifier(code)] = false;
        } else {
          this.data[this._getCouponIdentifier(code)] = data.data;
        }

        if (typeof cb === 'function') {
          cb.apply(this, arguments);
        }
      }, this));
    },

    getDiscount: function(code) {
      if (this.data[this._getCouponIdentifier(code)] !== undefined) {
        return this.data[this._getCouponIdentifier(code)];
      }
    },

    _getCouponIdentifier: function(code) {
      return celeryClient.config.userId + code;
    },

    data: {}
  };
});
