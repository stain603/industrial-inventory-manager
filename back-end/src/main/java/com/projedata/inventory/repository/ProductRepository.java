package com.projedata.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projedata.inventory.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
