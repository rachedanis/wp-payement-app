'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Stripe options
  stripeOptions: {
    apiKey: 'sk_test_vgduPM40EB4dOajaxO9E16QF',
    stripePubKey: 'pk_test_YmhldqT1hnBkELz2vFeHnEnI',
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
  },
  // Sequelize connection opions
  sequelize: {
    uri: 'mysql://root:root@localhost:3306/dev',
    options: {
      logging: false,
      storage: '',
      define: {
        timestamps: false
      }
    }
  },

  // Seed database on startup
  seedDB: true

};
