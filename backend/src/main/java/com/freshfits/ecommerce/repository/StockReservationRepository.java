package com.freshfits.ecommerce.repository;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class StockReservationRepository {

    private final EntityManager em;

    /**
     * Atomically reserves stock for all items.
     * Returns number of rows successfully updated.
     */
    public int reserveBatch(Map<Long, Integer> items) {

        StringBuilder sql = new StringBuilder("""
            UPDATE products_sizes ps
            JOIN (
        """);

        int i = 0;
        for (var entry : items.entrySet()) {
            if (i++ > 0) sql.append(" UNION ALL ");
            sql.append("SELECT ")
               .append(entry.getKey())
               .append(" AS product_size_id, ")
               .append(entry.getValue())
               .append(" AS qty");
        }

        sql.append("""
            ) r ON ps.id = r.product_size_id
            SET ps.reserved_quantity = ps.reserved_quantity + r.qty
            WHERE (ps.stock_quantity - ps.reserved_quantity) >= r.qty
        """);

        return em.createNativeQuery(sql.toString()).executeUpdate();
    }

    public List<Object[]> fetchStockState(Set<Long> ids) {
        return em.createNativeQuery("""
            SELECT id, stock_quantity, reserved_quantity
            FROM products_sizes
            WHERE id IN (:ids)
        """)
        .setParameter("ids", ids)
        .getResultList();
    }
}

