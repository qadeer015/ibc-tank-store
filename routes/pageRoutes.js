// routes/pageRoutes.js
const express = require('express');
const { settings } = require('node:cluster');
const router = express.Router();

// Uses of the ibc tanks
router.get('/uses-of-ibc-tanks', function (req, res) {
  res.render('public/pages/uses-of-ibc-tanks', {
    title: 'Uses of IBC Tanks',
    path: '/uses-of-ibc-tanks',
    canonicalPath: '/uses-of-ibc-tanks',
    metaTitle: 'Uses of IBC Tanks | IBC Tank Store - Pakistan\'s Leading IBC Tank Supplier',
    metaDescription: 'Discover the various uses of IBC tanks in industries such as agriculture, chemicals, food and beverage, pharmaceuticals, and more. Learn how IBC tanks can help you store and transport liquids efficiently.'
  });
});

router.get('/about', function (req, res) {
  res.render('public/pages/about', {
    title: 'About Us',
    path: '/about',
    canonicalPath: '/about',
    metaTitle: 'About Us | IBC Tank Store - Pakistan\'s Leading IBC Tank Supplier',
    metaDescription: 'Learn about IBC Tank Store - Pakistan\'s trusted supplier of IBC tanks since 2020. Our story, mission, and commitment to quality and customer satisfaction.'
  });
});

// About Page
router.get('/about', function (req, res) {
  res.render('public/pages/about', {
    title: 'About Us',
    path: '/about',
    canonicalPath: '/about',
    metaTitle: 'About Us | IBC Tank Store - Pakistan\'s Leading IBC Tank Supplier',
    metaDescription: 'Learn about IBC Tank Store - Pakistan\'s trusted supplier of IBC tanks since 2020. Our story, mission, and commitment to quality and customer satisfaction.'
  });
});

// Contact Page
router.get('/contact', function (req, res) {
  res.render('public/pages/contact', {
    title: 'Contact Us',
    path: '/contact',
    canonicalPath: '/contact',
    metaTitle: 'Contact Us | IBC Tank Store - Get a Free Quote',
    metaDescription: `Contact IBC Tank Store for IBC tank inquiries, bulk orders, and quotes. Phone: ${res.locals.settings.contact_number}. WhatsApp available. Lahore, Pakistan.`
  });
});

router.get('/warehouse-locations', function (req, res) {
  res.render('public/pages/warehouse-locations', {
    title: 'Warehouse Locations',
    path: '/warehouse-locations',
    canonicalPath: '/warehouse-locations'
  });
});

router.get('/faqs', function (req, res) {
  res.render('public/pages/faq', { title: 'FAQs' });
});

router.get('/privacy-policy', function (req, res) {
  res.render('public/pages/privacy', { title: 'Privacy Policy' });
});

router.get('/terms', function (req, res) {
  res.render('public/pages/terms', { title: 'Terms and Conditions' });
});

router.get('/order-tracking', function (req, res) {
  res.render('public/pages/track-order', { title: 'Order Tracking' });
});

router.get('/returns-and-refunds', function (req, res) {
  res.render('public/pages/return-refund-policy', { title: 'Returns and Refunds' });
});

router.get('/payment-methods', function (req, res) {
  res.render('public/pages/payment', { title: 'Payment Methods' });
});

router.get('/shipping-and-delivery', function (req, res) {
  res.render('public/pages/shipping-and-delivery', { title: 'Shipping and Delivery' });
});

router.get('/order-cancellation-policy', function (req, res) {
  res.render('public/pages/order-cancellation-policy', { title: 'Order Cancellation Policy' });
});

module.exports = router;