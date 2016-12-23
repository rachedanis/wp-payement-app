'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  sequelize: {
    uri:  process.env.SEQUELIZE_URI ||
          'mysql://root:root@localhost:3306/dist',
    options: {
      logging: false,
      storage: '',
      define: {
        timestamps: false
      }
    }
  },
  stripeOptions: {
    apiKey: process.env.STRIPE_KEY || 'sk_test_vgduPM40EB4dOajaxO9E16QF',
    stripePubKey: process.env.STRIPE_PUB_KEY || 'pk_test_YmhldqT1hnBkELz2vFeHnEnI',
    defaultPlan: 'free',
    planData: [{
        id:'free',
        name: 'Free',
        interval: "year",
        currency: "eur",
        amount: 0
      },{
        id:'monthly',
        name: 'Monthly',
        interval: "month",
        currency: "eur",
        amount: 10.00
      },{
        id:'annual',
        name: 'Annual',
        interval: "year",
        currency: "eur",
        amount: 100.00
      }
    ]
  }
};
