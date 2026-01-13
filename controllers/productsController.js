// controllers/productsController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Rating = require('../models/Rating');
const { getFileUrl, deleteFile } = require('../middlewares/upload');

const productController = {
    // productController.js
    async list(req, res) {
        try {
            let products = await Product.getAll();
            const categories = await Category.getAll();

            products = products.map(product => ({
                ...product,
                rating: parseFloat(product.rating).toFixed(1),
                price: parseFloat(product.price).toFixed(2)
            }));

            if (req.user && req.user.role === 'admin' && req.baseUrl === '/admin') {
                return res.render('admin/products/index', {
                    title: 'Products',
                    products,
                    categories,
                    viewPage: 'products',
                    success: req.flash('success'),
                    error: req.flash('error')
                });
            } else {
                res.render('public/products/index', {
                    title: 'Products',
                    products,
                    categories,
                    success: req.flash('success'),
                    error: req.flash('error')
                });
            }
        } catch (error) {
            console.error('Product list error:', error);
            req.flash('error', 'Failed to fetch products');
            res.redirect('/');
        }
    },

    async createForm(req, res) {
        const categories = await Category.getAll();
        res.render('admin/products/new', {
            title: 'Add New Product',
            viewPage: 'products-new',
            categories
        });
    },

    async create(req, res) {
        try {
            const { name, description, price, category_id, product_condition, stock } = req.body;
            // Support multiple files (field name 'image')
            console.log('Create - req.files:', req.files);
            const uploaded = (req.files && req.files.length) ? req.files.map(f => getFileUrl(f)) : [];

            if (!uploaded.length) {
                throw new Error('At least one product image is required');
            }

            console.log('Uploaded images:', uploaded);
            const imageField = JSON.stringify(uploaded);

            const newProduct = await Product.create(
                name,
                description,
                price,
                imageField,
                category_id,
                product_condition,
                stock
            );

            req.flash('success', 'Product created successfully');
            res.redirect(`/admin/products/${newProduct.id}`);
        } catch (error) {
            console.error('Create error:', error);
            req.flash('error', error.message || 'Failed to create product');
            res.redirect('/products/new');
        }
    },

    async show(req, res) {
        try {
            let product = await Product.getById(req.params.id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }
            const ratings = await Rating.getProductRatings(req.params.id);
            const productImages = product.images || [];

            product = {
                ...product,
                rating: product.rating ? parseFloat(product.rating).toFixed(1) : 0,
                price: parseFloat(product.price).toFixed(2)
            };
            if (req.user && req.user.role === 'admin' && req.baseUrl === '/admin') {
                res.render('admin/products/show', {
                    title: product.name,
                    viewPage: 'products-show',
                    product,
                    productImages,
                    ratings
                });
            } else {
                res.render('public/products/show', {
                    title: product.name,
                    ratings,
                    productImages,
                    product
                });
            }
        } catch (error) {
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
                categories
            });
        } catch (error) {
            req.flash('error', 'Failed to load edit form');
            res.redirect('/products');
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, category_id, product_condition, stock } = req.body;
            // existingImages can be a single value or an array
            let { existingImages } = req.body;

            console.log('Update - req.files:', req.files);
            console.log('Update - existingImages:', existingImages);

            const product = await Product.getById(id);

            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }
            // Normalize existingImages to array
            if (!existingImages) existingImages = [];
            else if (typeof existingImages === 'string') existingImages = [existingImages];

            // Parse original product images
            let originalImages = [];
            if (product.image) {
                try {
                    const parsed = JSON.parse(product.image);
                    if (Array.isArray(parsed)) originalImages = parsed;
                    else if (typeof parsed === 'string') originalImages = [parsed];
                } catch (err) {
                    originalImages = [product.image];
                }
            }

            // Determine removed images (present originally but not kept)
            const removed = originalImages.filter(img => !existingImages.includes(img));
            for (const rem of removed) {
                try {
                    await deleteFile(rem);
                } catch (err) {
                    console.error('Error deleting removed image:', err);
                }
            }

            // New uploaded files
            const newUploaded = (req.files && req.files.length) ? req.files.map(f => getFileUrl(f)) : [];

            // Final images to save
            const imagesToSave = [...existingImages, ...newUploaded];
            console.log('Images to save:', imagesToSave);
            if (!imagesToSave.length) {
                throw new Error('At least one product image is required');
            }

            const imageField = JSON.stringify(imagesToSave);
            console.log('Image field:', imageField);
            await Product.updateProduct(id, name, description, price, imageField, category_id, product_condition, stock);
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

            // Delete the product image if it exists and is from Cloudinary
            const product = await Product.getById(id);
            if (product && product.image) {
                let imgs = [];
                try {
                    const parsed = JSON.parse(product.image);
                    if (Array.isArray(parsed)) imgs = parsed;
                    else if (typeof parsed === 'string') imgs = [parsed];
                } catch (err) {
                    imgs = [product.image];
                }

                for (const img of imgs) {
                    try {
                        await deleteFile(img);
                    } catch (err) {
                        console.error('Error deleting product image:', err);
                    }
                }
            }

            const deleted = await Product.delete(id);

            if (deleted) {
                req.flash('success', 'Product deleted successfully');
            } else {
                req.flash('error', 'Product not found');
            }
            res.redirect('/admin/products');
        } catch (error) {
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
                currentCategory: categoryId
            });
        } catch (error) {
            req.flash('error', 'Failed to fetch products by category');
            res.redirect('/products');
        }
    }
};

module.exports = productController;