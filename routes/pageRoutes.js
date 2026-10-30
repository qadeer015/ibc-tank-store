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

router.get('/about', (req, res) => {
    res.render('public/pages/about', {
        title: 'About Us',
        metaDescription: 'Learn about IBC Tank Store — supplying new and used IBC tanks, drums, and insulation solutions across Pakistan from Lahore.',
    });
});

router.get('/faqs', (req, res) => {
    res.render('public/pages/faq', {
        title: 'FAQs',
        metaDescription: 'Frequently asked questions about IBC tanks, Sumandri Jhag, payments, delivery, and bulk orders at IBC Tank Store.',
        structuredData: FAQ_STRUCTURED_DATA,
    });
});

router.get('/privacy-policy', (req, res) => {
    res.render('public/pages/privacy', {
        title: 'Privacy Policy',
        metaDescription: 'Read the IBC Tank Store privacy policy to understand how we collect, use, and protect your personal information.',
    });
});

router.get('/terms', (req, res) => {
    res.render('public/pages/terms', {
        title: 'Terms and Conditions',
        metaDescription: 'Review the terms and conditions for shopping and using services at IBC Tank Store.',
    });
});

router.get('/order-tracking', (req, res) => {
    res.render('public/pages/track-order', {
        title: 'Order Tracking',
        metaDescription: 'Track your IBC Tank Store order status and get delivery updates for purchases across Pakistan.',
    });
});

router.get('/returns-and-refunds', (req, res) => {
    res.render('public/pages/return-refund-policy', {
        title: 'Returns and Refunds',
        metaDescription: 'Understand IBC Tank Store return and refund eligibility, timelines, and how to request support.',
    });
});

router.get('/payment-methods', (req, res) => {
    res.render('public/pages/payment', {
        title: 'Payment Methods',
        metaDescription: 'See accepted payment options at IBC Tank Store including cash on delivery, bank transfer, cards, JazzCash, and EasyPaisa.',
    });
});

router.get('/shipping-and-delivery', (req, res) => {
    res.render('public/pages/shipping-and-delivery', {
        title: 'Shipping and Delivery',
        metaDescription: 'IBC Tank Store shipping and delivery information for Lahore, Punjab, and nationwide orders in Pakistan.',
    });
});

router.get('/order-cancellation-policy', (req, res) => {
    res.render('public/pages/order-cancellation-policy', {
        title: 'Order Cancellation Policy',
        metaDescription: 'Learn how to cancel an IBC Tank Store order and what the cancellation policy covers.',
    });
});

module.exports = router;
