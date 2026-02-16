-- Disable FK checks
SET FOREIGN_KEY_CHECKS = 0;

-- Optional: clear tables before seeding
TRUNCATE TABLE slides;
TRUNCATE TABLE products;
TRUNCATE TABLE contacts;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
TRUNCATE TABLE settings;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- USERS (100)
-- =========================
DELIMITER $$

CREATE PROCEDURE seed_users()
BEGIN
  DECLARE i INT DEFAULT 1;

  -- Admin
  INSERT INTO users (name, email, password, role, email_verified, is_new)
  VALUES ('Admin User', 'admin@ibctankstore.com', '$2b$10$hashedpasswordexample', 'admin', 1, 0);

  WHILE i <= 99 DO
    INSERT INTO users (name, email, password, role, email_verified, is_new)
    VALUES (
      CONCAT('User ', i),
      CONCAT('user', i, '@example.com'),
      '$2b$10$hashedpasswordexample',
      'customer',
      1,
      0
    );
    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

CALL seed_users();
DROP PROCEDURE seed_users;

-- =========================
-- CATEGORIES (20)
-- =========================
DELIMITER $$

CREATE PROCEDURE seed_categories()
BEGIN
  DECLARE i INT DEFAULT 1;

  WHILE i <= 20 DO
    INSERT INTO categories (name)
    VALUES (CONCAT('Category ', i));
    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

CALL seed_categories();
DROP PROCEDURE seed_categories;

-- =========================
-- PRODUCTS (100)
-- =========================
DELIMITER $$

CREATE PROCEDURE seed_products()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE cat_id INT;

  WHILE i <= 100 DO

    SET cat_id = FLOOR(1 + RAND() * 20);

    INSERT INTO products
    (name, description, price, image, category_id, product_condition, stock, additional_info, specs)
    VALUES (
      CONCAT('Product ', i),
      CONCAT('Description for product ', i),
      ROUND(1000 + RAND() * 90000, 2),
      CONCAT('https://res.cloudinary.com/dlfxf7tws/image/upload/v1757868656/subhan-trader/products/mdmnuslhhwirfjcrxnki', '.png'),
      cat_id,
      IF(RAND() > 0.5, 'New', 'Used'),
      FLOOR(1 + RAND() * 100),
      JSON_OBJECT('brand', CONCAT('Brand ', i), 'material', 'HDPE'),
      JSON_OBJECT('capacity', CONCAT(FLOOR(500 + RAND()*5000), 'L'))
    );

    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

CALL seed_products();
DROP PROCEDURE seed_products;

-- =========================
-- PRODUCT IMAGES (Random 1–4 per product)
-- =========================
DELIMITER $$

CREATE PROCEDURE seed_product_images()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE p_id INT;
  DECLARE img_count INT;
  DECLARE i INT;

  -- Cursor to loop through all products
  DECLARE product_cursor CURSOR FOR SELECT id FROM products;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN product_cursor;

  read_loop: LOOP
    FETCH product_cursor INTO p_id;
    IF done THEN
      LEAVE read_loop;
    END IF;

    -- Random 1 to 4 images per product
    SET img_count = FLOOR(1 + RAND() * 4);
    SET i = 1;

    WHILE i <= img_count DO
      INSERT INTO product_images
      (product_id, url, sort_order)
      VALUES (
        p_id,
        CONCAT(
          'https://res.cloudinary.com/dlfxf7tws/image/upload/v1757868656/subhan-trader/products/mdmnuslhhwirfjcrxnki',
          '.png'
        ),
        i
      );

      SET i = i + 1;
    END WHILE;

  END LOOP;

  CLOSE product_cursor;
END$$

DELIMITER ;

CALL seed_product_images();
DROP PROCEDURE seed_product_images;

-- =========================
-- SLIDES (20)
-- =========================
DELIMITER $$

CREATE PROCEDURE seed_slides()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE product_id INT;

  WHILE i <= 20 DO

    SET product_id = FLOOR(1 + RAND() * 100);

    INSERT INTO slides
    (product_id, image, title, description, link, display_order)
    VALUES (
      product_id,
      CONCAT('https://res.cloudinary.com/dlfxf7tws/image/upload/v1757868656/subhan-trader/products/mdmnuslhhwirfjcrxnki', '.png'),
      CONCAT('Slide Title ', i),
      CONCAT('Promotional description ', i),
      CONCAT('/products/', product_id),
      i
    );

    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

CALL seed_slides();
DROP PROCEDURE seed_slides;

-- =========================
-- CONTACTS (100)
-- =========================
DELIMITER $$

CREATE PROCEDURE seed_contacts()
BEGIN
  DECLARE i INT DEFAULT 1;

  WHILE i <= 100 DO
    INSERT INTO contacts (name, email, contact_no, message, status)
    VALUES (
      CONCAT('Customer ', i),
      CONCAT('customer', i, '@mail.com'),
      CONCAT('03', FLOOR(100000000 + RAND()*899999999)),
      CONCAT('Inquiry message number ', i),
      IF(RAND() > 0.5, 'new', 'read')
    );

    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

CALL seed_contacts();
DROP PROCEDURE seed_contacts;

-- =========================
-- SETTINGS
-- =========================
INSERT INTO settings (`key`, `value`) VALUES
('notify_contact_submission', '1'),
('notification_method', 'email'),
('notification_endpoint', ''),
('contact_number', '03001234567'),
('price_currency', 'Rs. '),
('tinymce_api_key', '')
ON DUPLICATE KEY UPDATE value = VALUES(value);