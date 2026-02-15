package com.projedata.inventory.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projedata.inventory.model.Product;
import com.projedata.inventory.model.ProductMaterial;
import com.projedata.inventory.model.RawMaterial;
import com.projedata.inventory.repository.ProductRepository;
import com.projedata.inventory.repository.RawMaterialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class ProductIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Clear database before each test
        productRepository.deleteAll();
        rawMaterialRepository.deleteAll();
    }

    @Test
    void testCompleteProductWorkflow() throws Exception {
        // 1. Create raw material
        RawMaterial material = new RawMaterial();
        material.setCode("RM001");
        material.setName("Test Material");
        material.setStockQuantity(new BigDecimal("100"));

        String materialJson = objectMapper.writeValueAsString(material);
        
        mockMvc.perform(post("/raw-materials")
                .contentType(MediaType.APPLICATION_JSON)
                .content(materialJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Material"));

        // 2. Create product
        Product product = new Product();
        product.setCode("P001");
        product.setName("Test Product");
        product.setPrice(new BigDecimal("150.00"));

        String productJson = objectMapper.writeValueAsString(product);
        
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));

        // 3. Associate raw material to product
        ProductMaterial association = new ProductMaterial();
        association.setQuantityRequired(5);
        
        // Here you would need to adjust according to your implementation
        // This is a conceptual example
        
        // 4. Verify if product was saved in database
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Product"));
    }

    @Test
    void testProductionEndpointIntegration() throws Exception {
        // Create test data
        createTestData();
        
        // Test production endpoint
        mockMvc.perform(get("/production/suggestions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    private void createTestData() throws Exception {
        // Create raw materials
        RawMaterial material1 = new RawMaterial();
        material1.setCode("RM001");
        material1.setName("Material A");
        material1.setStockQuantity(new BigDecimal("100"));

        RawMaterial material2 = new RawMaterial();
        material2.setCode("RM002");
        material2.setName("Material B");
        material2.setStockQuantity(new BigDecimal("50"));

        mockMvc.perform(post("/raw-materials")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(material1)));

        mockMvc.perform(post("/raw-materials")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(material2)));

        // Criar produtos
        Product product1 = new Product();
        product1.setCode("P001");
        product1.setName("Product A");
        product1.setPrice(new BigDecimal("100.00"));

        Product product2 = new Product();
        product2.setCode("P002");
        product2.setName("Product B");
        product2.setPrice(new BigDecimal("200.00"));

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product1)));

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product2)));
    }
}
