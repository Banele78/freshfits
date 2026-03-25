CREATE INDEX idx_products_sizes_stock
ON products_sizes (id, stock_quantity, reserved_quantity);
