// server.js
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const path = require('path');
const morgan = require("morgan");
const passport = require('passport');
const flash = require('connect-flash');
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./db'); // MySQL connection pool
const Product = require('../models/Product');
const Category = require('../models/Category');
const settingMiddleware = require("../middlewares/settings");

// Routes
const productRoutes = require('../routes/productRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const contactRoutes = require('../routes/contactRoutes');
const pageRoutes = require('../routes/pageRoutes');
const uploadRoutes = require('../routes/upload.route');
const authRoutes = require("../routes/authRoutes");
const adminRoutes = require("../routes/adminRoutes");
const reviewRoutes = require("../routes/reviewsRoutes");
const aiRoutes = require("../routes/aiRoutes");
const quoteRoutes = require("../routes/quoteRoutes");

require('dotenv').config({
    quiet: true
});

require('./passport');

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    skip: function (req, res) {
        return res.statusCode < 400;
    }
}));
app.use(methodOverride("_method"));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);

app.set("layout", "layouts/public");

app.use(express.static(path.join(__dirname, '../public')));
// Serve static files from uploads directory in development
if (process.env.NODE_ENV !== 'production') {
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// server.js
const sessionStore = new MySQLStore({
    expiration: 86400000, // 1 day in milliseconds
    createDatabaseTable: true, // Will create sessions table if it doesn't exist
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, pool);

app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Passport and flash middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(settingMiddleware);

app.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
    res.locals.user = req.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.path = req.originalUrl;
    res.locals.title = "IBC Tank Store";
    res.locals.productImages = [];
    res.locals.featuredProducts = [];
    res.locals.minPrice = 0;
    res.locals.maxPrice = 0;
    res.locals.condition = '';
    res.locals.latestProducts = '';
    res.locals.searchQuery = '';

    // Set layout
    if (res.locals.user?.role !== 'developer' && res.locals.settings.restrict_for_payment) {
        res.locals.layout = "layouts/dev_payment";
    } else if (req.path.startsWith("/admin")) {
        res.locals.layout = "layouts/admin";
    } else {
        res.locals.layout = "layouts/public";
    }
    next();
});

app.get('/', async (req, res, next) => {
    try {
        // Explicitly convert all numeric parameters
        let featuredProducts = await Product.getTopRated(4, 5);
        const categories = await Category.getAll({ activeOnly: true });
        let latestProducts = await Product.getLatest(8);

        const searchQuery = req.query.search || '';
        const selectedCategory = req.query.category || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 1000;
        const condition = req.query.condition || '';

        latestProducts = latestProducts.map(product => ({
            ...product,
            rating: parseFloat(product.rating).toFixed(1),
            price: parseInt(product.price)
        }));

        featuredProducts = featuredProducts.map(product => ({
            ...product,
            rating: parseFloat(product.rating).toFixed(1),
            price: parseInt(product.price)
        }));

        featuredProducts = featuredProducts.map(product => ({
            ...product,
            rating: parseFloat(product.rating).toFixed(1),
            price: parseFloat(product.price).toFixed(2)
        }));


        // NOTE: the settings cookie is already saved by middlewares/settings.js
        // (which runs before this handler). An earlier copy of this block passed
        // the raw Setting.all() array to jwt.sign() and logged an error on every
        // uncached home page hit — removed.

        res.render('public/home', {
            title: 'Home',
            featuredProducts,
            latestProducts,
            categories,
            searchQuery,
            selectedCategory,
            minPrice,
            maxPrice,
            condition,
            productImages: [],
            user: req.user,
            metaTitle: "IBC Tank Store - Pakistan's #1 Supplier of IBC Tanks & Storage Solutions",
            metaDescription: "Pakistan's trusted supplier of 1000 Liter IBC Tanks. Water, chemical, fertilizer & industrial storage tanks with nationwide delivery. Get a free quote today!",
            metaKeywords: "IBC Tank Pakistan, IBC Tank Lahore, 1000 Liter Water Tank, IBC Tank Price Pakistan, Chemical Storage Tank, Food Grade IBC Tank, Fertilizer IBC Tank",
            canonicalPath: '/',
            path: '/',
            schemaMarkup: null
        });
    } catch (error) {
        console.error('Homepage error:', error);
        // Render the error page instead of redirecting: bouncing between '/'
        // and '/products' could loop forever when both pages failed.
        next(error);
    }
});

// Search endpoint
app.get('/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, condition } = req.query;
        let products = await Product.search({
            query: q,
            categoryId: category,
            minPrice: parseInt(minPrice),
            maxPrice: parseInt(maxPrice),
            condition
        });

        products = products.map(product => ({
            ...product,
            rating: parseFloat(product.rating).toFixed(1),
            price: parseInt(product.price)
        }));

        const categories = await Category.getAll();
        res.render('public/search', {
            title: 'Search Results',
            products,
            categories,
            searchQuery: q,
            selectedCategory: category,
            minPrice,
            maxPrice,
            condition,
            productImages: [],
            user: req.user
        });
    } catch (error) {
        console.error('Search error:', error);
        req.flash('error', 'Search failed');
        res.redirect('/');
    }
});

// Routes
app.use('/', pageRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/contact', contactRoutes);
app.use("/auth", authRoutes);
app.use("/reviews", reviewRoutes);
app.use("/uploads", uploadRoutes);
app.use("/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/quote", quoteRoutes);

// ========== ADD 404 HANDLER HERE ==========
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        viewPage: "404",
        user: req.user || null
    });
});
// ==========================================

// Error handling middleware (keep this after 404 handler)
// IMPORTANT: never redirect from here. The previous version did
// res.redirect('/'), which produced an infinite redirect loop
// (ERR_TOO_MANY_REDIRECTS) whenever the '/' route itself failed.
app.use((err, req, res, next) => {
    console.error(err.stack || err);
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).render('error', {
        title: 'Server Error',
        // Don't leak stack traces / internals in production
        error: process.env.NODE_ENV === 'production'
            ? { message: 'Something went wrong. Please try again later.' }
            : err,
        user: req.user || null
    });
});

module.exports = app;
