// controllers/productsController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { deleteFile } = require('../middlewares/upload');

// ─────────────────────────────────────────────────────────────
// Helper: parse the imageUrls field sent as JSON from the client
// Returns an array of URL strings, or throws if none are found.
// ─────────────────────────────────────────────────────────────
function parseImageUrls(body) {
    let urls = [];

    if (body.imageUrls) {
        try {
            const parsed = JSON.parse(body.imageUrls);
            if (Array.isArray(parsed)) urls = parsed.filter(Boolean);
        } catch {
            // imageUrls sent as a plain string (single URL)
            if (typeof body.imageUrls === 'string' && body.imageUrls.trim()) {
                urls = [body.imageUrls.trim()];
            }
        }
    }

    return urls;
}

// ─────────────────────────────────────────────────────────────
// Helper: build a key→value object from parallel arrays
// Skips pairs where the key is blank.
// ─────────────────────────────────────────────────────────────
function buildKVObject(keys, values) {
    const rawKeys = Array.isArray(keys) ? keys : [keys].filter(Boolean);
    const rawVals = Array.isArray(values) ? values : [values].filter(Boolean);

    const obj = {};
    rawKeys.forEach((key, idx) => {
        if (key && key.trim()) {
            obj[key.trim()] = rawVals[idx] ?? '';
        }
    });

    return Object.keys(obj).length > 0 ? obj : null;
}

const productController = {

    async list(req, res, next) {
        try {
            let products = await Product.getAll();
            const categories = await Category.getAll();

            products = products.map(product => ({
                ...product,
                rating: parseFloat(product.rating).toFixed(1),
                price: parseInt(product.price),
            }));

            const searchQuery = req.query.search || '';
            const selectedCategory = req.query.category || '';
            const minPrice = parseFloat(req.query.minPrice) || 0;
            const maxPrice = parseFloat(req.query.maxPrice) || 1000;
            const condition = req.query.condition || '';

            // Guarded + parenthesised: the old expression crashed with a
            // TypeError for logged-out visitors (req.user.role on undefined).
            if (req.user && (req.user.role === 'admin' || req.user.role === 'developer') && req.baseUrl === '/admin') {
                return res.render('admin/products/index', {
                    title: 'Products',
                    products,
                    categories,
                    viewPage: 'products',
                    success: req.flash('success'),
                    error: req.flash('error'),
                });
            }

            res.render('public/products/index', {
                title: 'Products',
                products,
                categories,
                searchQuery,
                selectedCategory,
                viewPage: 'products',
                minPrice,
                maxPrice,
                condition,
                success: req.flash('success'),
                error: req.flash('error'),
            });
        } catch (error) {
            console.error('Product list error:', error);
            // next(error) instead of res.redirect('/'): redirecting here could
            // bounce endlessly between '/' and '/products' when both failed.
            next(error);
        }
    },

    async createForm(req, res) {
        const categories = await Category.getAll();
        res.render('admin/products/new', {
            title: 'Add New Product',
            viewPage: 'products-new',
            categories,
        });
    },

    async create(req, res) {
        try {
            const { name, description, price, category_id, product_condition, stock } = req.body;
            const {
                additional_info_key = [],
                additional_info_value = [],
                specs_key = [],
                specs_value = [],
            } = req.body;

            // ── Images come from the client as a JSON array of already-uploaded URLs ──
            const imageUrls = parseImageUrls(req.body);
            if (!imageUrls.length) {
                throw new Error('At least one product image is required');
            }

            const imageField = JSON.stringify(imageUrls);
            const additionalInfoJson = buildKVObject(additional_info_key, additional_info_value);
            const specsJson = buildKVObject(specs_key, specs_value);

            const newProduct = await Product.create(
                name,
                description,
                price,
                imageField,
                category_id,
                product_condition,
                stock,
                additionalInfoJson,
                specsJson,
            );

            req.flash('success', 'Product created successfully');
            res.redirect(`/admin/products/${newProduct.id}`);
        } catch (error) {
            console.error('Create error:', error);
            req.flash('error', error.message || 'Failed to create product');
            res.redirect('/admin/products/new');
        }
    },

    async show(req, res) {
        try {
            let product = await Product.getById(req.params.id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }

            const reviews = await Review.getProductReviews(req.params.id);
            const productImages = product.images || [];

            product = {
                ...product,
                rating: product.rating ? parseFloat(product.rating).toFixed(1) : 0,
                price: parseInt(product.price),
            };

            const view = (req.user && (req.user.role === 'admin' || req.user.role === 'developer') && req.baseUrl === '/admin')
                ? 'admin/products/show'
                : 'public/products/show';

            res.render(view, {
                title: product.name,
                viewPage: 'products-show',
                product,
                productImages,
                reviews,
            });
        } catch (error) {
            console.error('Show error:', error);
            req.flash('error', 'Failed to fetch product details');
            res.redirect('/products');
        }
    },

    async editForm(req, res) {
        try {
            const product = await Product.getById(req.params.id);
            const categories = await Category.getAll();

            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }

            const productImages = product.images || [];

            res.render('admin/products/edit', {
                title: `Edit ${product.name}`,
                product,
                productImages,
                viewPage: 'products-edit',
                categories,
            });
        } catch (error) {
            console.error('Edit form error:', error);
            req.flash('error', 'Failed to load edit form');
            res.redirect('/products');
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, category_id, product_condition, stock } = req.body;
            const {
                additional_info_key = [],
                additional_info_value = [],
                specs_key = [],
                specs_value = [],
            } = req.body;

            const product = await Product.getById(id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }

            // ── Images: client sends all final URLs (existing + newly uploaded) ──
            const imageUrls = parseImageUrls(req.body);
            if (!imageUrls.length) {
                throw new Error('At least one product image is required');
            }

            // Parse what was stored originally so we can delete removed images
            let originalImages = [];
            if (product.image) {
                try {
                    const parsed = JSON.parse(product.image);
                    if (Array.isArray(parsed)) originalImages = parsed;
                    else if (typeof parsed === 'string') originalImages = [parsed];
                } catch {
                    originalImages = [product.image];
                }
            }

            // Delete images that were present before but are now removed
            const removed = originalImages.filter(img => !imageUrls.includes(img));
            for (const url of removed) {
                try { await deleteFile(url); }
                catch (err) { console.error('Error deleting removed image:', err); }
            }

            const imageField = JSON.stringify(imageUrls);
            const additionalInfoJson = buildKVObject(additional_info_key, additional_info_value);
            const specsJson = buildKVObject(specs_key, specs_value);

            await Product.updateProduct(
                id, name, description, price, imageField,
                category_id, product_condition, stock,
                additionalInfoJson, specsJson,
            );

            req.flash('success', 'Product updated successfully');
            res.redirect(`/admin/products/${id}`);
        } catch (error) {
            console.error('Update error:', error);
            req.flash('error', error.message || 'Failed to update product');
            res.redirect(`/admin/products/${req.params.id}/edit`);
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.getById(id);

            if (product && product.image) {
                let imgs = [];
                try {
                    const parsed = JSON.parse(product.image);
                    if (Array.isArray(parsed)) imgs = parsed;
                    else if (typeof parsed === 'string') imgs = [parsed];
                } catch {
                    imgs = [product.image];
                }

                for (const img of imgs) {
                    try { await deleteFile(img); }
                    catch (err) { console.error('Error deleting product image:', err); }
                }
            }

            const deleted = await Product.delete(id);
            req.flash(deleted ? 'success' : 'error',
                deleted ? 'Product deleted successfully' : 'Product not found');
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Delete error:', error);
            req.flash('error', 'Failed to delete product');
            res.redirect('/products');
        }
    },

    async listByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const products = await Product.getByCategory(categoryId);
            const category = await Category.getById(categoryId);

            res.render('public/products/list', {
                title: `Products in ${category.name}`,
                products,
                currentCategory: categoryId,
            });
        } catch (error) {
            console.error('List by category error:', error);
            req.flash('error', 'Failed to fetch products by category');
            res.redirect('/products');
        }
    },
};

module.exports = productController;