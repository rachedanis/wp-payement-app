'use strict';

import {User} from '../../sqldb';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

var stripe = require("stripe")(config.stripeOptions.apiKey);

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.findAll({
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'address',
      'phone',
      'birthday',
      'payement_offer'
    ]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('subscriptionId', 'none');
  newUser.setDataValue('role', 'user');
  var customer = stripe.customers.create({
  email: newUser.email,
  }, function(err, customer) {
    console.log(customer.id);
    newUser.customerId=customer.id;
    newUser.save();
    if (err) {
      console.log(err);
    }
  });
  return newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.destroy({ _id: req.params.id })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'address',
      'phone',
      'subscriptionId',
      'customerId',
      'cardId',
      'birthday',
      'payement_offer'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}

export function subscribe (req, res, next) {
  if (req.body.user.subscriptionId == "none"){
    console.log("CREATE");
    stripe.customers.createSource(
      req.body.user.customerId,
      {source: req.body.stripeToken},
      function(err, card) {
        if (err) {
          console.log(err);
        }
      }
    );
    stripe.subscriptions.create({
    customer: req.body.user.customerId,
    plan: req.body.payement_offer
    }, function(err, subscription) {
      if (err) {
        console.log(err);
      }
      else {
        User.find({
          where: {
            _id: req.body.user._id
          }
        })
          .then(user => {
              user.subscriptionId = subscription.id;
              user.payement_offer = req.body.payement_offer;
              return user.save()
                .then(() => {
                  res.status(204).end();
                })
                .catch(validationError(res));
          });
      }
    });
  } else {
    console.log("UPDATE");
    stripe.customers.createSource(
      req.body.user.customerId,
      {source: req.body.stripeToken},
      function(err, card) {
        if (err) {
          console.log(err);
        }
      }
    );
    stripe.subscriptions.update(req.body.user.subscriptionId, {
    plan: req.body.payement_offer,
    }, function(err, subscription) {
      if (err) {
        console.log(err);
      } else {
        User.find({
          where: {
            _id: req.body.user._id
          }
        })
          .then(user => {
              user.payement_offer = req.body.payement_offer;
              return user.save()
                .then(() => {
                  res.status(204).end();
                })
                .catch(validationError(res));
          });
      }
    }
    );
  }
}
