CREATE INDEX idx_products_price
ON products (price);

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_products_brand
ON products(brand_id);

CREATE INDEX idx_products_department
ON products(department_id);

-- Compound index for filter API (MOST IMPORTANT)
CREATE INDEX idx_products_active_filters
ON products (is_active, category_id, brand_id, department_id, price);
