package com.projedata.inventory.controller;

import com.projedata.inventory.model.ProductMaterial;
import com.projedata.inventory.repository.ProductMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-materials")
@CrossOrigin(origins = "*")
public class ProductMaterialController {

    @Autowired
    private ProductMaterialRepository repository;

    @GetMapping(produces = "application/json")
    public List<ProductMaterial> findAll() {
        return repository.findAll();
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ProductMaterial findById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductMaterial not found"));
    }

    @PostMapping(produces = "application/json")
    public ProductMaterial create(@RequestBody ProductMaterial productMaterial) {
        return repository.save(productMaterial);
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    public ProductMaterial update(@PathVariable Long id, @RequestBody ProductMaterial updated) {
        ProductMaterial productMaterial = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductMaterial not found"));

        productMaterial.setProduct(updated.getProduct());
        productMaterial.setRawMaterial(updated.getRawMaterial());
        productMaterial.setQuantityRequired(updated.getQuantityRequired());

        return repository.save(productMaterial);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @GetMapping(value = "/product/{productId}", produces = "application/json")
    public List<ProductMaterial> findByProductId(@PathVariable Long productId) {
        return repository.findByProductId(productId);
    }
}
