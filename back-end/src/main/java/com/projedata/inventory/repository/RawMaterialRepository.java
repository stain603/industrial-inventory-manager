package com.projedata.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projedata.inventory.model.RawMaterial;

/**
 * Repository interface for RawMaterial entity operations.
 * Provides CRUD operations for raw material management.
 */
public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {
}
