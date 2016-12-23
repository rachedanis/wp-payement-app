/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
import config from '../config/environment';

var Post = sqldb.Post;
var User = sqldb.User;

var stripe = require("stripe")(config.stripeOptions.apiKey);
for (var i=0; i < config.stripeOptions.planData.length; i++) {
  stripe.plans.create(config.stripeOptions.planData[i], function(err, plan) {
  });
}

User.sync()
  .then(() => User.destroy({ where: {} }))
  .then(() => {
    User.bulkCreate([{
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin',
      payement_offer: 'annual',
      phone: '111111111',
      address: '33 rue Y 75000',
      birthday: '20/01/1994'
    }])
    .then(() => {
      console.log('finished populating users');
    });
  });
