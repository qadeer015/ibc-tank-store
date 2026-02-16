// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/signin', (req, res) => {
  res.render('public/auth/signin', { user: req.user, title:'Signin'});
});

router.post('/logout', authController.logoutUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/signin',
    failureFlash: true
  }),
  authController.signWithGoogle
);

module.exports = router;