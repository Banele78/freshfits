-- ========================================
-- INDEXES FOR CART OPTIMIZATION
-- ========================================

-- 1. cart_items: filter by cart_id and order by added_at
CREATE INDEX idx_cart_items_cart_addedAt
ON cart_items (cart_id, added_at DESC);

-- 2. cart_items: join on product_size_id
CREATE INDEX idx_cart_items_product_size
ON cart_items (product_size_id);

-- 3. products_sizes: join on product_id and size_id
CREATE INDEX idx_products_sizes_product_size
ON products_sizes (product_id, size_id);

-- 4. products: join on id
-- already primary key, no need to add

-- 5. product_images: join on product_id and filter on is_primary
CREATE INDEX idx_product_images_product_primary
ON product_images (product_id, is_primary);

