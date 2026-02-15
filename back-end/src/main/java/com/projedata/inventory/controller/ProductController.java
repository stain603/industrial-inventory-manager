package com.projedata.inventory.controller;

import com.projedata.inventory.model.Product;
import com.projedata.inventory.model.ProductMaterial;
import com.projedata.inventory.model.RawMaterial;
import com.projedata.inventory.repository.ProductRepository;
import com.projedata.inventory.repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    // FIND ALL
    @GetMapping(produces = "application/json")
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    // CREATE
    @PostMapping(produces = "application/json")
    public Product create(@RequestBody Product product) {

        product.setId(null);

        if (product.getMaterials() != null) {

            for (ProductMaterial pm : product.getMaterials()) {

                if (pm.getRawMaterial() != null && pm.getRawMaterial().getId() != null) {

                    RawMaterial rawMaterial = rawMaterialRepository
                            .findById(pm.getRawMaterial().getId())
                            .orElseThrow(() -> new RuntimeException("Raw material not found"));

                    pm.setProduct(product);
                    pm.setRawMaterial(rawMaterial);
                }
            }
        }

        return productRepository.save(product);
    }

    // FIND BY ID
    @GetMapping(value = "/{id}", produces = "application/json")
    public Product findById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // UPDATE
    @PutMapping(value = "/{id}", produces = "application/json")
    public Product update(@PathVariable Long id, @RequestBody Product updatedProduct) {

        return productRepository.findById(id)
                .map(product -> {

                    product.setName(updatedProduct.getName());
                    product.setPrice(updatedProduct.getPrice());
                    product.setCode(updatedProduct.getCode());

                    product.getMaterials().clear();

                    if (updatedProduct.getMaterials() != null) {

                        for (ProductMaterial pm : updatedProduct.getMaterials()) {

                            RawMaterial rawMaterial = rawMaterialRepository
                                    .findById(pm.getRawMaterial().getId())
                                    .orElseThrow(() -> new RuntimeException("Raw material not found"));

                            pm.setProduct(product);
                            pm.setRawMaterial(rawMaterial);

                            product.getMaterials().add(pm);
                        }
                    }

                    return productRepository.save(product);

                }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}
