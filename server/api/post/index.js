'use strict';

var express = require('express');
var controller = require('./post.controller');
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.get('/premium', auth.isAuthenticated() && auth.hasPremiumOffer(), controller.index);
router.get('/free', auth.isAuthenticated(), controller.showFree);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
