package com.projedata.inventory;

import com.projedata.inventory.model.RawMaterial;
import com.projedata.inventory.repository.RawMaterialRepository;
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
public class RawMaterialTest {

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @Test
    void testFindAllRawMaterials() {
        // Arrange: Setup mock data
        RawMaterial material1 = new RawMaterial();
        material1.setId(1L);
        material1.setCode("RM001");
        material1.setName("Raw Material 1");
        material1.setStockQuantity(new BigDecimal("100"));

        RawMaterial material2 = new RawMaterial();
        material2.setId(2L);
        material2.setCode("RM002");
        material2.setName("Raw Material 2");
        material2.setStockQuantity(new BigDecimal("200"));

        when(rawMaterialRepository.findAll()).thenReturn(Arrays.asList(material1, material2));

        // Act: Execute method
        List<RawMaterial> result = rawMaterialRepository.findAll();

        // Assert: Verify result
        assertEquals(2, result.size());
        assertEquals("Raw Material 1", result.get(0).getName());
        assertEquals("Raw Material 2", result.get(1).getName());
        verify(rawMaterialRepository, times(1)).findAll();
    }

    @Test
    void testFindRawMaterialById() {
        // Arrange: Setup mock raw material
        RawMaterial material = new RawMaterial();
        material.setId(1L);
        material.setCode("RM001");
        material.setName("Test Material");
        material.setStockQuantity(new BigDecimal("150"));

        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(material));

        // Act: Search raw material
        Optional<RawMaterial> result = rawMaterialRepository.findById(1L);

        // Assert: Verify result
        assertTrue(result.isPresent());
        assertEquals("Test Material", result.get().getName());
        assertEquals("RM001", result.get().getCode());
        verify(rawMaterialRepository, times(1)).findById(1L);
    }

    @Test
    void testSaveRawMaterial() {
        // Arrange: Setup raw material to save
        RawMaterial newMaterial = new RawMaterial();
        newMaterial.setCode("RM003");
        newMaterial.setName("New Material");
        newMaterial.setStockQuantity(new BigDecimal("300"));

        RawMaterial savedMaterial = new RawMaterial();
        savedMaterial.setId(3L);
        savedMaterial.setCode("RM003");
        savedMaterial.setName("New Material");
        savedMaterial.setStockQuantity(new BigDecimal("300"));

        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(savedMaterial);

        // Act: Save raw material
        RawMaterial result = rawMaterialRepository.save(newMaterial);

        // Assert: Verify result
        assertNotNull(result.getId());
        assertEquals("New Material", result.getName());
        assertEquals("RM003", result.getCode());
        verify(rawMaterialRepository, times(1)).save(any(RawMaterial.class));
    }

    @Test
    void testUpdateRawMaterial() {
        // Arrange: Setup existing raw material
        RawMaterial existingMaterial = new RawMaterial();
        existingMaterial.setId(1L);
        existingMaterial.setCode("RM001");
        existingMaterial.setName("Old Name");
        existingMaterial.setStockQuantity(new BigDecimal("100"));

        RawMaterial updatedMaterial = new RawMaterial();
        updatedMaterial.setId(1L);
        updatedMaterial.setCode("RM001");
        updatedMaterial.setName("Updated Name");
        updatedMaterial.setStockQuantity(new BigDecimal("150"));

        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(updatedMaterial);

        // Act: Update raw material
        RawMaterial result = rawMaterialRepository.save(updatedMaterial);

        // Assert: Verify result
        assertEquals("Updated Name", result.getName());
        assertEquals(new BigDecimal("150"), result.getStockQuantity());
        verify(rawMaterialRepository, times(1)).save(any(RawMaterial.class));
    }

    @Test
    void testDeleteRawMaterial() {
        // Arrange: Setup delete
        doNothing().when(rawMaterialRepository).deleteById(1L);

        // Act: Delete raw material
        rawMaterialRepository.deleteById(1L);

        // Assert: Verify if was called
        verify(rawMaterialRepository, times(1)).deleteById(1L);
    }
}
