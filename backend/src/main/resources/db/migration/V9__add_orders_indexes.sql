CREATE INDEX idx_orders_user_created
ON orders (user_id, created_at);

CREATE INDEX idx_order_items_order
ON order_items (order_id);


