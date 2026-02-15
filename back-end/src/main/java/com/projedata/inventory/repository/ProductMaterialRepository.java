package com.projedata.inventory.repository;

import com.projedata.inventory.model.ProductMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductMaterialRepository extends JpaRepository<ProductMaterial, Long> {
    List<ProductMaterial> findByProductId(Long productId);
}
