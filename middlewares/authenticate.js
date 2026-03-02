// middlewares/authenticate.js
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // For POST/PUT/DELETE requests or AJAX requests, respond with JSON
  if (req.method !== 'GET' || req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access this resource',
      requiresAuth: true
    });
  }

  // Store the original URL to redirect after login
  req.session.returnTo = req.originalUrl;

  // Set flag to show auth modal instead of redirecting
  res.locals.showAuthModal = true;
  req.flash('info', 'Please sign in to access this feature');

  // Render the home page with auth modal shown, providing all required variables
  res.render('public/home', {
    layout: 'layouts/public',
    searchQuery: '',
    products: [],
    categories: []
  });
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role == 'admin') {
    return next();
  }
  req.flash('error', 'You do not have admin privileges');
  res.redirect('/');
};

module.exports = {
  isAuthenticated,
  isAdmin
};