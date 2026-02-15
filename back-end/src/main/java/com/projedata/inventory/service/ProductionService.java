package com.projedata.inventory.service;

import com.projedata.inventory.model.Product;
import com.projedata.inventory.model.ProductMaterial;
import com.projedata.inventory.model.RawMaterial;
import com.projedata.inventory.repository.ProductRepository;
import com.projedata.inventory.repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.math.RoundingMode;
import java.util.stream.Collectors;

@Service
public class ProductionService {
    @Autowired private ProductRepository productRepository;
    @Autowired private RawMaterialRepository materialRepository;

    public List<Product> getSuggestion() {
        
        List<Product> products = productRepository.findAll().stream()
            .sorted(Comparator.comparing(Product::getPrice).reversed())
            .toList();

        Map<Long, BigDecimal> tempStock;
        List<RawMaterial> materials = materialRepository.findAll();
        if (materials == null || materials.isEmpty()) {
            tempStock = new java.util.HashMap<>();
        } else {
            tempStock = materials.stream()
                .collect(Collectors.toMap(RawMaterial::getId, RawMaterial::getStockQuantity));
        }

        List<Product> suggestions = new ArrayList<>();

        for (Product product : products) {
            int canProduce = calculateMaxProduction(product, tempStock);
            
            // Always set the values, even if it's 0
            product.setProducibleQuantity(canProduce);
            product.setTotalValue(product.getPrice().multiply(BigDecimal.valueOf(canProduce)));
            
            // Add all products, not just those that can be produced
            suggestions.add(product);
               
            // Update stock only if production is possible
            if (canProduce > 0) {
                updateTempStock(product, canProduce, tempStock);
            }
        }
        return suggestions;
    }

    private int calculateMaxProduction(Product p, Map<Long, BigDecimal> stock) {
        // If no materials are associated, return a default value (e.g., 999)
        if (p.getMaterials() == null || p.getMaterials().isEmpty()) {
            return 999; // Consider as producible in large quantities
        }
        
        return p.getMaterials().stream()
            .mapToInt(pm -> {
                if (pm.getRawMaterial() == null || pm.getQuantityRequired() == null || pm.getQuantityRequired() <= 0) {
                    return 0;
                }
                BigDecimal materialStock = stock.get(pm.getRawMaterial().getId());
                if (materialStock == null || materialStock.compareTo(BigDecimal.ZERO) <= 0) {
                    return 0;
                }
                return materialStock.divide(BigDecimal.valueOf(pm.getQuantityRequired()), RoundingMode.DOWN).intValue();
            })
            .min().orElse(0);
    }

    private void updateTempStock(Product product, int quantity, Map<Long, BigDecimal> stock) {
        if (product.getMaterials() == null) {
            return;
        }
        
        for (ProductMaterial pm : product.getMaterials()) {
            if (pm.getRawMaterial() == null || pm.getQuantityRequired() == null) {
                continue;
            }
            
            Long materialId = pm.getRawMaterial().getId();
            BigDecimal currentStock = stock.get(materialId);
            if (currentStock != null) {
                BigDecimal usedQuantity = BigDecimal.valueOf(pm.getQuantityRequired() * quantity);
                stock.put(materialId, currentStock.subtract(usedQuantity));
            }
        }
    }
}