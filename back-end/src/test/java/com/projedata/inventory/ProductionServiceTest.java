package com.projedata.inventory;

import com.projedata.inventory.model.Product;
import com.projedata.inventory.model.ProductMaterial;
import com.projedata.inventory.model.RawMaterial;
import com.projedata.inventory.repository.ProductRepository;
import com.projedata.inventory.repository.RawMaterialRepository;
import com.projedata.inventory.service.ProductionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductionServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RawMaterialRepository materialRepository;

    @InjectMocks
    private ProductionService productionService;

    private Product highValueProduct;
    private Product mediumValueProduct;
    private Product lowValueProduct;
    private RawMaterial materialA;
    private RawMaterial materialB;
    private RawMaterial materialC;

    @BeforeEach
    void setUp() {
        // Setup products with different values (high to low)
        highValueProduct = new Product();
        highValueProduct.setId(1L);
        highValueProduct.setName("High Value Product");
        highValueProduct.setPrice(new BigDecimal("200.00"));

        mediumValueProduct = new Product();
        mediumValueProduct.setId(2L);
        mediumValueProduct.setName("Medium Value Product");
        mediumValueProduct.setPrice(new BigDecimal("100.00"));

        lowValueProduct = new Product();
        lowValueProduct.setId(3L);
        lowValueProduct.setName("Low Value Product");
        lowValueProduct.setPrice(new BigDecimal("50.00"));

        // Setup raw materials
        materialA = new RawMaterial();
        materialA.setId(1L);
        materialA.setName("Material A");
        materialA.setStockQuantity(new BigDecimal("100"));

        materialB = new RawMaterial();
        materialB.setId(2L);
        materialB.setName("Material B");
        materialB.setStockQuantity(new BigDecimal("60"));

        materialC = new RawMaterial();
        materialC.setId(3L);
        materialC.setName("Material C");
        materialC.setStockQuantity(new BigDecimal("30"));
    }

    @Test
    void testGetSuggestion_PrioritizesByPrice() {
        // Arrange: High value product uses material A, medium uses material B, low uses material C
        ProductMaterial pmHigh = new ProductMaterial();
        pmHigh.setProduct(highValueProduct);
        pmHigh.setRawMaterial(materialA);
        pmHigh.setQuantityRequired(10);

        ProductMaterial pmMedium = new ProductMaterial();
        pmMedium.setProduct(mediumValueProduct);
        pmMedium.setRawMaterial(materialB);
        pmMedium.setQuantityRequired(10);

        ProductMaterial pmLow = new ProductMaterial();
        pmLow.setProduct(lowValueProduct);
        pmLow.setRawMaterial(materialC);
        pmLow.setQuantityRequired(10);

        highValueProduct.setMaterials(Arrays.asList(pmHigh));
        mediumValueProduct.setMaterials(Arrays.asList(pmMedium));
        lowValueProduct.setMaterials(Arrays.asList(pmLow));

        // Return products in random order to test sorting
        when(productRepository.findAll()).thenReturn(Arrays.asList(lowValueProduct, highValueProduct, mediumValueProduct));
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA, materialB, materialC));

        // Act
        List<Product> result = productionService.getSuggestion();

        // Assert: Should be ordered by price (high to low)
        assertEquals(3, result.size());
        assertEquals("High Value Product", result.get(0).getName());
        assertEquals("Medium Value Product", result.get(1).getName());
        assertEquals("Low Value Product", result.get(2).getName());

        // Verify quantities and values
        assertEquals(10, result.get(0).getProducibleQuantity());
        assertEquals(new BigDecimal("2000.00"), result.get(0).getTotalValue());

        assertEquals(6, result.get(1).getProducibleQuantity());
        assertEquals(new BigDecimal("600.00"), result.get(1).getTotalValue());

        assertEquals(3, result.get(2).getProducibleQuantity());
        assertEquals(new BigDecimal("150.00"), result.get(2).getTotalValue());
    }

    @Test
    void testGetSuggestion_SharedMaterialsCompetition() {
        // Arrange: Multiple products share the same material
        ProductMaterial pmHigh = new ProductMaterial();
        pmHigh.setProduct(highValueProduct);
        pmHigh.setRawMaterial(materialA);
        pmHigh.setQuantityRequired(5);

        ProductMaterial pmMedium = new ProductMaterial();
        pmMedium.setProduct(mediumValueProduct);
        pmMedium.setRawMaterial(materialA);
        pmMedium.setQuantityRequired(10);

        highValueProduct.setMaterials(Arrays.asList(pmHigh));
        mediumValueProduct.setMaterials(Arrays.asList(pmMedium));

        when(productRepository.findAll()).thenReturn(Arrays.asList(mediumValueProduct, highValueProduct));
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA));

        // Act
        List<Product> result = productionService.getSuggestion();

        // Assert: High value product should be prioritized
        assertEquals(1, result.size());
        assertEquals("High Value Product", result.get(0).getName());
        assertEquals(20, result.get(0).getProducibleQuantity()); // Uses all material first
    }

    @Test
    void testGetSuggestion_NoMaterialsAvailable() {
        // Arrange: Product without materials
        highValueProduct.setMaterials(Arrays.asList());
        
        when(productRepository.findAll()).thenReturn(Arrays.asList(highValueProduct));
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA));

        // Act
        List<Product> result = productionService.getSuggestion();

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetSuggestion_InsufficientMaterials() {
        // Arrange: Product requires more material than available
        ProductMaterial pm = new ProductMaterial();
        pm.setProduct(highValueProduct);
        pm.setRawMaterial(materialA);
        pm.setQuantityRequired(200); // More than available (100)

        highValueProduct.setMaterials(Arrays.asList(pm));

        when(productRepository.findAll()).thenReturn(Arrays.asList(highValueProduct));
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA));

        // Act
        List<Product> result = productionService.getSuggestion();

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetSuggestion_EmptyProductList() {
        // Arrange
        when(productRepository.findAll()).thenReturn(Collections.emptyList());
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA));

        // Act
        List<Product> result = productionService.getSuggestion();

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetSuggestion_EmptyMaterialList() {
        // Arrange
        ProductMaterial pm = new ProductMaterial();
        pm.setProduct(highValueProduct);
        pm.setRawMaterial(materialA);
        pm.setQuantityRequired(10);

        highValueProduct.setMaterials(Arrays.asList(pm));

        when(productRepository.findAll()).thenReturn(Arrays.asList(highValueProduct));
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA));

        // Act
        List<Product> result = productionService.getSuggestion();

        // Assert
        assertFalse(result.isEmpty());
    }

    @Test
    void testGetSuggestion_MultipleMaterialsPerProduct() {
        // Arrange: Product requires multiple materials
        ProductMaterial pm1 = new ProductMaterial();
        pm1.setProduct(highValueProduct);
        pm1.setRawMaterial(materialA);
        pm1.setQuantityRequired(10);

        ProductMaterial pm2 = new ProductMaterial();
        pm2.setProduct(highValueProduct);
        pm2.setRawMaterial(materialB);
        pm2.setQuantityRequired(5);

        highValueProduct.setMaterials(Arrays.asList(pm1, pm2));

        when(productRepository.findAll()).thenReturn(Arrays.asList(highValueProduct));
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA, materialB));

        // Act
        List<Product> result = productionService.getSuggestion();

        // Assert: Limited by material B (60/5 = 12) vs material A (100/10 = 10)
        assertEquals(1, result.size());
        assertEquals("High Value Product", result.get(0).getName());
        assertEquals(10, result.get(0).getProducibleQuantity()); // Limited by material A
        assertEquals(new BigDecimal("2000.00"), result.get(0).getTotalValue());
    }

    @Test
    void testGetSuggestion_VerifyRepositoryCalls() {
        // Arrange
        ProductMaterial pm = new ProductMaterial();
        pm.setProduct(highValueProduct);
        pm.setRawMaterial(materialA);
        pm.setQuantityRequired(10);

        highValueProduct.setMaterials(Arrays.asList(pm));

        when(productRepository.findAll()).thenReturn(Arrays.asList(highValueProduct));
        when(materialRepository.findAll()).thenReturn(Arrays.asList(materialA));

        // Act
        productionService.getSuggestion();

        // Assert
        verify(productRepository, times(1)).findAll();
        verify(materialRepository, times(1)).findAll();
    }
}
