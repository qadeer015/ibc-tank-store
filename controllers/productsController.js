// controllers/productsController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Rating = require('../models/Rating');
const { getFileUrl } = require('../middlewares/upload');

const productController = {
    // productController.js
    async list(req, res) {
        try {
            let products = await Product.getAll();
            const categories = await Category.getAll();

            products = products.map(product => ({
                ...product,
                rating: parseFloat(product.rating).toFixed(1),
                price: parseInt(product.price)
            }));

            if (req.user && req.user.role === 'admin') {
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
            console.error('Product list error:', error);  // Detailed error log
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
            const { additional_info_key = [], additional_info_value = [], specs_key = [], specs_value = [] } = req.body;
            
            const uploaded = (req.files && req.files.length) ? req.files.map(f => getFileUrl(f)) : [];

            if (!image) {
                throw new Error('Product image is required');
            }

            const imageField = JSON.stringify(uploaded);

            // Build additional_info object from key-value arrays
            let additionalInfoJson = null;
            if (Array.isArray(additional_info_key) && additional_info_key.length > 0) {
                additionalInfoJson = {};
                const keys = Array.isArray(additional_info_key) ? additional_info_key : [additional_info_key];
                const values = Array.isArray(additional_info_value) ? additional_info_value : [additional_info_value];
                keys.forEach((key, idx) => {
                    if (key && key.trim()) {
                        additionalInfoJson[key.trim()] = values[idx] || '';
                    }
                });
                if (Object.keys(additionalInfoJson).length === 0) additionalInfoJson = null;
            }

            // Build specs object from key-value arrays
            let specsJson = null;
            if (Array.isArray(specs_key) && specs_key.length > 0) {
                specsJson = {};
                const keys = Array.isArray(specs_key) ? specs_key : [specs_key];
                const values = Array.isArray(specs_value) ? specs_value : [specs_value];
                keys.forEach((key, idx) => {
                    if (key && key.trim()) {
                        specsJson[key.trim()] = values[idx] || '';
                    }
                });
                if (Object.keys(specsJson).length === 0) specsJson = null;
            }

            const newProduct = await Product.create(
                name,
                description,
                price,
                image,
                category_id,
                product_condition,
                stock,
                additionalInfoJson,
                specsJson
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
            
            product = {
                ...product,
                rating: product.rating ? parseFloat(product.rating).toFixed(1) : 0,
                price: parseInt(product.price)
            };

            if (req.user && req.user.role === 'admin' && req.baseUrl === '/admin') {
                res.render('admin/products/show', {
                    title: product.name,
                    viewPage: 'products-show',
                    product,
                    ratings
                });
            } else {
                res.render('public/products/show', {
                    title: product.name,
                    ratings,
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

            res.render('admin/products/edit', {
                title: `Edit ${product.name}`,
                product,
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
            const { additional_info_key = [], additional_info_value = [], specs_key = [], specs_value = [] } = req.body;
            // existingImages can be a single value or an array
            let { existingImages } = req.body;

            const product = await Product.getById(id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }
            // If a new image is uploaded, use it; otherwise, keep the existing image
            let productImage = existingImage;
             if (req.file) {
                // Delete old image if it exists and is from Cloudinary
                if (product.image && product.image.includes('res.cloudinary.com')) {
                    try {
                        const publicId = product.image.split('/').slice(-2).join('/').split('.')[0];
                        if(publicId){
                            await cloudinary.uploader.destroy(publicId);
                        }
                    } catch (err) {
                        console.error('Error deleting old avatar:', err);
                    }
                }
                productImage = getFileUrl(req.file);
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
            if (!imagesToSave.length) {
                throw new Error('At least one product image is required');
            }

            const imageField = JSON.stringify(imagesToSave);

            // Build additional_info object from key-value arrays
            let additionalInfoJson = null;
            if (Array.isArray(additional_info_key) && additional_info_key.length > 0) {
                additionalInfoJson = {};
                const keys = Array.isArray(additional_info_key) ? additional_info_key : [additional_info_key];
                const values = Array.isArray(additional_info_value) ? additional_info_value : [additional_info_value];
                keys.forEach((key, idx) => {
                    if (key && key.trim()) {
                        additionalInfoJson[key.trim()] = values[idx] || '';
                    }
                });
                if (Object.keys(additionalInfoJson).length === 0) additionalInfoJson = null;
            }

            // Build specs object from key-value arrays
            let specsJson = null;
            if (Array.isArray(specs_key) && specs_key.length > 0) {
                specsJson = {};
                const keys = Array.isArray(specs_key) ? specs_key : [specs_key];
                const values = Array.isArray(specs_value) ? specs_value : [specs_value];
                keys.forEach((key, idx) => {
                    if (key && key.trim()) {
                        specsJson[key.trim()] = values[idx] || '';
                    }
                });
                if (Object.keys(specsJson).length === 0) specsJson = null;
            }

            await Product.updateProduct(id, name, description, price, imageField, category_id, product_condition, stock, additionalInfoJson, specsJson);
            req.flash('success', 'Product updated successfully');
            res.redirect(`/admin/products/${id}`);
        } catch (error) {
            req.flash('error', 'Failed to update product');
            res.redirect(`/admin/products/${req.params.id}/edit`);
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            // Delete the product image if it exists and is from Cloudinary
            const product = await Product.getById(id);
            if (product && product.image && product.image.includes('res.cloudinary.com')) {
                try {
                    const publicId = product.image.split('/').slice(-2).join('/').split('.')[0];
                    if(publicId){
                        await cloudinary.uploader.destroy(publicId);
                    }
                } catch (err) {
                    console.error('Error deleting product image:', err);
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