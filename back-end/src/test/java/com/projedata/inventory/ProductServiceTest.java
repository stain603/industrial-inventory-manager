package com.projedata.inventory;

import com.projedata.inventory.model.Product;
import com.projedata.inventory.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Test
    void testFindAllProducts() {
        // Arrange: Configurar dados mock
        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Product 1");
        product1.setPrice(new BigDecimal("100.00"));

        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Product 2");
        product2.setPrice(new BigDecimal("200.00"));

        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2));

        // Act: Execute method
        List<Product> result = productRepository.findAll();

        // Assert: Verify result
        assertEquals(2, result.size());
        assertEquals("Product 1", result.get(0).getName());
        assertEquals("Product 2", result.get(1).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void testFindById() {
        // Arrange: Setup mock product
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(new BigDecimal("150.00"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act: Search product
        Optional<Product> result = productRepository.findById(1L);

        // Assert: Verify result
        assertTrue(result.isPresent());
        assertEquals("Test Product", result.get().getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testSaveProduct() {
        // Arrange: Setup product to save
        Product newProduct = new Product();
        newProduct.setName("New Product");
        newProduct.setPrice(new BigDecimal("300.00"));

        Product savedProduct = new Product();
        savedProduct.setId(3L);
        savedProduct.setName("New Product");
        savedProduct.setPrice(new BigDecimal("300.00"));

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // Act: Save product
        Product result = productRepository.save(newProduct);

        // Assert: Verify result
        assertNotNull(result.getId());
        assertEquals("New Product", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void testDeleteProduct() {
        // Arrange: Setup delete
        doNothing().when(productRepository).deleteById(1L);

        // Act: Delete product
        productRepository.deleteById(1L);

        // Assert: Verify if was called
        verify(productRepository, times(1)).deleteById(1L);
    }
}
