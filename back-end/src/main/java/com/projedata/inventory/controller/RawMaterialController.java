package com.projedata.inventory.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.projedata.inventory.model.RawMaterial;
import com.projedata.inventory.repository.RawMaterialRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/raw-materials")
public class RawMaterialController {

    private final RawMaterialRepository repository;

    public RawMaterialController(RawMaterialRepository repository) {
        this.repository = repository;
    }

    @GetMapping(produces = "application/json")
    public List<RawMaterial> getAll() {
        return repository.findAll();
    }

    @PostMapping(produces = "application/json")
    public RawMaterial create(@RequestBody RawMaterial rawMaterial) {
        return repository.save(rawMaterial);
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    public RawMaterial update(@PathVariable Long id, @RequestBody RawMaterial updated) {
        RawMaterial material = repository.findById(id)
                .orElseThrow();

        material.setName(updated.getName());
        material.setCode(updated.getCode());
        material.setStockQuantity(updated.getStockQuantity());

        return repository.save(material);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
