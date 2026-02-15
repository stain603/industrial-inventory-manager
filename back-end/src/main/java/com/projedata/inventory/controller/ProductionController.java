package com.projedata.inventory.controller;

import com.projedata.inventory.model.Product;
import com.projedata.inventory.service.ProductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/production")
public class ProductionController {

    @Autowired
    private ProductionService productionService;

    @GetMapping(value = "/suggestions", produces = "application/json")
    public List<Product> getProductionSuggestions() {
        return productionService.getSuggestion();
    }
}
