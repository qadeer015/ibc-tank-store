// models/Product.js
const db = require("../config/db");

class Product {
    static async create(name, description, price, images, category_id, product_condition, stock, additional_info = null, specs = null) {
        // `images` can be a JSON string, array or single url string
        let imgs = [];
        if (images) {
            if (typeof images === 'string') {
                try {
                    imgs = JSON.parse(images);
                    if (!Array.isArray(imgs)) imgs = [imgs];
                } catch (err) {
                    imgs = [images];
                }
            } else if (Array.isArray(images)) {
                imgs = images;
            } else if (typeof images === 'object' && images !== null) {
                // fallback
                imgs = [String(images)];
            }
        }

        const primaryImage = imgs.length ? imgs[0] : null;

        // Parse JSON fields if they're strings
        let additionalInfoJson = null;
        let specsJson = null;

        if (additional_info) {
            additionalInfoJson = typeof additional_info === 'string' ? JSON.parse(additional_info) : additional_info;
        }

        if (specs) {
            specsJson = typeof specs === 'string' ? JSON.parse(specs) : specs;
        }

        const [insertResult] = await db.execute(
            'INSERT INTO products (name, description, price, image, category_id, product_condition, stock, additional_info, specs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, primaryImage, category_id, product_condition, stock, JSON.stringify(additionalInfoJson), JSON.stringify(specsJson)]
        );
        const [rows] = await db.execute(
            'SELECT * FROM products WHERE id = ?',
            [insertResult.insertId]
        );
        return rows[0];
    }

    static async count() {
        const [rows] = await db.execute('SELECT COUNT(*) AS count FROM products');
        return rows[0].count;
    }

    static async getAll() {
        const sqlQuery = `
            SELECT p.*, c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.execute(sqlQuery);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(`
    SELECT 
      p.*,
      c.name AS category_name,
      ROUND(AVG(r.rating), 1) AS rating,
      COUNT(r.id) AS rating_count
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN ratings r ON r.product_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
  `, [id]);

        return rows[0];
    }

    static async delete(id) {
        const result = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return result;
    }

    static async getTopRated(minRating = 4, limit = 5) {
        try {
            minRating = Number(minRating) || 4;
            limit = Number(limit) || 5;

            const sql = `
      SELECT 
        p.*,
        c.name AS category_name,
        ROUND(AVG(r.rating), 1) AS rating,
        COUNT(r.id) AS rating_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN ratings r ON r.product_id = p.id
      GROUP BY p.id, c.name  -- Add c.name to GROUP BY
      HAVING rating >= ${minRating}
      ORDER BY rating DESC, rating_count DESC
      LIMIT ${limit}
    `;

            const [rows] = await db.execute(sql);
            return rows;

        } catch (error) {
            console.error('Error in getTopRated:', error);
            throw error;
        }
    }

    
    static async getLatest(limit = 8) {
        try {
            limit = Number(limit) || 8;
            
            // For TiDB, interpolate the LIMIT value directly
            const [rows] = await db.execute(
                `SELECT p.*, c.name AS category_name 
                 FROM products p
                 JOIN categories c ON p.category_id = c.id
                 ORDER BY p.created_at DESC
                 LIMIT ${limit}`
            );
            return rows;
        } catch (error) {
            console.error('Error in getLatest:', error);
            throw error;
        }
    }

    static async updateProduct(id, name, description, price, image, category_id, product_condition, stock, additional_info = null, specs = null) {
        // `image` may be a JSON array string, an array, or a single url
        let imgs = [];
        if (image) {
            if (typeof image === 'string') {
                try {
                    imgs = JSON.parse(image);
                    if (!Array.isArray(imgs)) imgs = [imgs];
                } catch (err) {
                    imgs = [image];
                }
            } else if (Array.isArray(image)) {
                imgs = image;
            } else if (typeof image === 'object' && image !== null) {
                imgs = [String(image)];
            }
        }

        const primaryImage = imgs.length ? imgs[0] : null;

        // Parse JSON fields if they're strings
        let additionalInfoJson = null;
        let specsJson = null;

        if (additional_info) {
            additionalInfoJson = typeof additional_info === 'string' ? JSON.parse(additional_info) : additional_info;
        }

        if (specs) {
            specsJson = typeof specs === 'string' ? JSON.parse(specs) : specs;
        }

        const [result] = await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ?, product_condition = ?, stock = ?, additional_info = ?, specs = ? WHERE id = ?',
            [name, description, price, primaryImage, category_id, product_condition, stock, JSON.stringify(additionalInfoJson), JSON.stringify(specsJson), id]
        );

        // replace images in product_images
        try {
            await db.execute('DELETE FROM product_images WHERE product_id = ?', [id]);
            if (imgs.length) {
                for (let i = 0; i < imgs.length; i++) {
                    const url = imgs[i];
                    await db.execute('INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)', [id, url, i]);
                }
            }
        } catch (err) {
            console.error('Failed to update product_images for product', id, err);
        }

        return result;
    }
    
    static async search({ query, categoryId, minPrice, maxPrice, product_condition }) {
        try {
            // Build query safely for TiDB
            let sql = `SELECT p.*, c.name AS category_name 
                       FROM products p
                       JOIN categories c ON p.category_id = c.id
                       WHERE 1=1`;
            const params = [];
            
            if (query) {
                sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
                params.push(`%${query}%`, `%${query}%`);
            }
            
            if (categoryId) {
                sql += ` AND p.category_id = ?`;
                params.push(parseInt(categoryId, 10));
            }
            
            if (minPrice) {
                sql += ` AND p.price >= ?`;
                params.push(parseFloat(minPrice));
            }
            
            if (maxPrice) {
                sql += ` AND p.price <= ?`;
                params.push(parseFloat(maxPrice));
            }

            if (product_condition) {
                sql += ` AND LOWER(p.product_condition) = ?`;
                params.push(product_condition.toLowerCase());
            }
            
            sql += ` ORDER BY p.created_at DESC`;
            
            const [rows] = await db.execute(sql, params);
            return rows;
        } catch (error) {   
            console.error('Error in search:', error);
            throw error;
        }
    }
// static async search({ query, categoryId, minPrice, maxPrice, product_condition }) {
//     let sql = `SELECT p.*, c.name AS category_name 
//                FROM products p
//                JOIN categories c ON p.category_id = c.id
//                WHERE 1=1`;
//     const params = [];
    
//     if (query) {
//         sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
//         params.push(`%${query}%`, `%${query}%`);
//     }
    
//     if (categoryId) {
//         sql += ` AND p.category_id = ?`;
//         params.push(categoryId);
//     }
    
//     if (minPrice) {
//         sql += ` AND p.price >= ?`;
//         params.push(minPrice);
//     }
    
//     if (maxPrice) {
//         sql += ` AND p.price <= ?`;
//         params.push(maxPrice);
//     }
    
//     if (product_condition) {
//         sql += ` AND p.product_condition = ?`;
//         params.push(product_condition);
//     }
    
//     sql += ` ORDER BY p.created_at DESC`;
    
//     const [rows] = await db.execute(sql, params);
//     return rows;
// }
}

module.exports = Product;
