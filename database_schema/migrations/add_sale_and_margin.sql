-- Adds promotional sale price and admin-only margin percent to products.
-- Safe to run more than once on MySQL 8 / MariaDB that support IF NOT EXISTS for columns.
-- If your server rejects ADD COLUMN IF NOT EXISTS, run the two ALTER statements once by hand.

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2) NULL AFTER stock,
    ADD COLUMN IF NOT EXISTS margin_percent DECIMAL(5,2) NULL AFTER sale_price;
