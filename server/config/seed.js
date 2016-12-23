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
      name: 'Test annual',
      email: 'annual@example.com',
      password: 'test',
      payement_offer: 'annual',
      phone: '000000000',
      address: '14 rue X 75001',
      birthday: '22/11/1999'
    }, {
      name: 'Test monthly',
      email: 'monthly@example.com',
      password: 'test',
      payement_offer: 'monthly',
      phone: '828282828288',
      address: '34 rue Z 75001',
      birthday: '22/11/1999'
    },{
      name: 'Test free',
      email: 'free@example.com',
      password: 'test',
      phone: '72727272727',
      address: '33 rue P 75001',
      birthday: '22/11/1999'
    }, {
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
