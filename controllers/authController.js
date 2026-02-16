// controllers/authController.js
const { sendEmail } = require("../api/emailService");
const renderTemplate = require("../utils/templateRenderer");
const User = require("../models/User");

const logoutUser = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    // Save flash message first
    req.flash('success', 'You have been logged out successfully');

    req.session.destroy(err => {
      if (err) return next(err);

      res.clearCookie('connect.sid'); // clear session cookie
      res.redirect('/');
    });
  });
};

const signWithGoogle = async (req, res) => {
  const user = req.user;
  const settings = res.locals.settings || {};

  // Prepare email HTML and decide if we should send it
  let sendEmailFlag = false;
  let html = "";

  if (user.is_new) {
    // New user → always send welcome email
    html = renderTemplate("welcome.html", {
      user_name: user.name,
      year: new Date().getFullYear(),
      app_name: settings.app_name || "IBC Tank Store",
    });

    await User.isNewUser(user.id); // mark user as no longer new
    sendEmailFlag = true;
  } else if (settings.notify_after_signin) {
    // Existing user → send only if setting enabled
    html = renderTemplate("signin.html", {
      user_name: user.name,
      year: new Date().getFullYear(),
      app_name: settings.app_name || "IBC Tank Store",
      email: user.email,
      username: user.name,
      date: new Date().toDateString(),
    });
    sendEmailFlag = true;
  }

  // Fire-and-forget email
  if (sendEmailFlag) {
    sendEmail({
      to: user.email,
      subject: user.is_new ? "Welcome to IBC Tank Store" : "Sign in to IBC Tank Store",
      text: user.is_new
        ? `Welcome ${user.name} to IBC Tank Store!`
        : "You have signed in to IBC Tank Store",
      html,
    }).catch((err) => console.error("Error sending email:", err));
  }

  // Redirect based on role
  if (user.role === "admin") {
    req.flash("success", "Welcome Admin! You have logged in successfully");
    return res.redirect("/admin/dashboard");
  }

  req.flash("success", "You have logged in successfully");
  return res.redirect("/");
};

module.exports = {
  logoutUser,
  signWithGoogle
}