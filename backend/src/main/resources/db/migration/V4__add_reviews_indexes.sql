CREATE UNIQUE INDEX idx_review_user_product
ON reviews (user_id, product_id);

