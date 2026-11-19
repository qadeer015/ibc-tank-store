// routes/pageRoutes.js
const express = require('express');
const router = express.Router();

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of IBC tanks do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer both new and used IBC tanks in various sizes (1000L, 1200L, etc.) suitable for water, chemicals, and food-grade liquids. Our tanks include cage, plastic, and stainless steel options.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Sumandri Jhag insulation material?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sumandri Jhag is our premium insulating material specifically designed for temperature control of storage containers. It's durable, weather-resistant, and perfect for maintaining contents at stable temperatures in Pakistan's climate.",
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept cash on delivery (within Lahore), bank transfers, credit/debit cards (Visa, MasterCard), and JazzCash/EasyPaisa for smaller orders.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer discounts for bulk orders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer significant discounts for bulk purchases of IBC tanks, drums, or Sumandri Jhag. Contact our sales team at 03204904565 for customized quotes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are your delivery options?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lahore: free delivery for orders over PKR 50,000. Punjab: delivery within 3-5 business days. Other provinces: delivery via reliable carriers. Self pickup is available from our Lahore warehouse.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I track my order?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, for orders shipped outside Lahore we provide tracking via SMS and WhatsApp. For local Lahore deliveries, our representative will contact you 1 hour before arrival.',
      },
    },
  ],
};

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
    canonicalPath: '/warehouse-locations',
    metaDescription:
      'Find IBC Tank Store warehouse and pickup locations in Lahore and across Pakistan for IBC tank orders.',
  });
});

router.get('/faqs', function (req, res) {
  res.render('public/pages/faq', {
    title: 'FAQs',
    path: '/faqs',
    canonicalPath: '/faqs',
    metaDescription:
      'Frequently asked questions about IBC tanks, Sumandri Jhag, payments, delivery, and bulk orders at IBC Tank Store.',
    schemaMarkup: FAQ_STRUCTURED_DATA,
  });
});

router.get('/privacy-policy', function (req, res) {
  res.render('public/pages/privacy', {
    title: 'Privacy Policy',
    path: '/privacy-policy',
    canonicalPath: '/privacy-policy',
    metaDescription:
      'Read the IBC Tank Store privacy policy to understand how we collect, use, and protect your personal information.',
  });
});

router.get('/terms', function (req, res) {
  res.render('public/pages/terms', {
    title: 'Terms and Conditions',
    path: '/terms',
    canonicalPath: '/terms',
    metaDescription: 'Review the terms and conditions for shopping and using services at IBC Tank Store.',
  });
});

router.get('/order-tracking', require('../controllers/orderController').track);

router.get('/returns-and-refunds', function (req, res) {
  res.render('public/pages/return-refund-policy', {
    title: 'Returns and Refunds',
    path: '/returns-and-refunds',
    canonicalPath: '/returns-and-refunds',
    metaDescription:
      'Understand IBC Tank Store return and refund eligibility, timelines, and how to request support.',
  });
});

router.get('/payment-methods', function (req, res) {
  res.render('public/pages/payment', {
    title: 'Payment Methods',
    path: '/payment-methods',
    canonicalPath: '/payment-methods',
    metaDescription:
      'See accepted payment options at IBC Tank Store including cash on delivery, bank transfer, cards, JazzCash, and EasyPaisa.',
  });
});

router.get('/shipping-and-delivery', function (req, res) {
  res.render('public/pages/shipping-and-delivery', {
    title: 'Shipping and Delivery',
    path: '/shipping-and-delivery',
    canonicalPath: '/shipping-and-delivery',
    metaDescription:
      'IBC Tank Store shipping and delivery information for Lahore, Punjab, and nationwide orders in Pakistan.',
  });
});

router.get('/order-cancellation-policy', function (req, res) {
  res.render('public/pages/order-cancellation-policy', {
    title: 'Order Cancellation Policy',
    path: '/order-cancellation-policy',
    canonicalPath: '/order-cancellation-policy',
    metaDescription:
      'Learn how to cancel an IBC Tank Store order and what the cancellation policy covers.',
  });
});

module.exports = router;