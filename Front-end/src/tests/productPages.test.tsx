import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Products } from '../pages/Products'

// Service mock
vi.mock('../services/api', () => ({
  productsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  rawMaterialsApi: {
    getAll: vi.fn()
  }
}))

// React-router-dom mock
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

// Wrapper for components
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Products Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render products list correctly', async () => {
    // Arrange: Data mock
    const { productsApi } = await import('../services/api')
    
    const mockProducts = [
      {
        id: '1',
        code: 'P001',
        name: 'Product 1',
        price: 100.0,
        materials: []
      }
    ]

    vi.mocked(productsApi.getAll).mockResolvedValue(mockProducts)

    // Act: Render component
    renderWithRouter(<Products />)

    // Assert: Verify elements on screen
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })
  })

  it('should show loading state initially', async () => {
    // Arrange: Loading mock
    vi.doMock('../services/api', () => ({
      productsApi: {
        getAll: vi.fn(() => new Promise(() => {})) // Never resolves
      }
    }))
    
    const { Products } = await import('../pages/Products')

    // Act: Render component
    renderWithRouter(<Products />)

    // Assert: Verify loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should handle error state', async () => {
    // Arrange: Error mock
    const { productsApi } = await import('../services/api')
    vi.mocked(productsApi.getAll).mockRejectedValue(new Error('Network error'))

    // Act: Render component
    renderWithRouter(<Products />)

    // Assert: Verify error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading products/)).toBeInTheDocument()
    })
  })

  it('should open new product modal when button clicked', async () => {
    // Arrange: Data mock
    const { productsApi } = await import('../services/api')
    vi.mocked(productsApi.getAll).mockResolvedValue([])

    // Act: Render and click button
    renderWithRouter(<Products />)
    
    await waitFor(() => {
      const addButton = screen.getByText('Add Product')
      fireEvent.click(addButton)
    })

    // Assert: Verify modal opened
    await waitFor(() => {
      expect(screen.getByText('New Product')).toBeInTheDocument()
      expect(screen.getByLabelText('Product Code')).toBeInTheDocument()
      expect(screen.getByLabelText('Product Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Price')).toBeInTheDocument()
    })
  })

  it('should create new product when form submitted', async () => {
    // Arrange: Setup mocks and rendering
    const { productsApi } = await import('../services/api')
    vi.mocked(productsApi.getAll).mockResolvedValue([])
    vi.mocked(productsApi.create).mockResolvedValue({
      id: '2',
      code: 'P002',
      name: 'New Product',
      price: 200.0,
      materials: []
    })

    renderWithRouter(<Products />)

    // Act: Open modal and fill form
    await waitFor(() => {
      fireEvent.click(screen.getByText('Add Product'))
    })

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Product Code'), {
        target: { value: 'P002' }
      })
      fireEvent.change(screen.getByLabelText('Product Name'), {
        target: { value: 'New Product' }
      })
      fireEvent.change(screen.getByLabelText('Price'), {
        target: { value: '200' }
      })
      fireEvent.click(screen.getByText('Save'))
    })

    // Assert: Verify create was called
    await waitFor(() => {
      expect(productsApi.create).toHaveBeenCalledWith({
        name: 'New Product',
        code: 'P002',
        price: 200.0,
        materials: []
      })
    })
  })

  it('should update existing product when form submitted', async () => {
    // Arrange: Setup mocks and rendering
    const { productsApi } = await import('../services/api')
    const mockProducts = [
      {
        id: '1',
        code: 'P001',
        name: 'Product 1',
        price: 100.0,
        materials: []
      }
    ]
    
    vi.mocked(productsApi.getAll).mockResolvedValue(mockProducts)
    vi.mocked(productsApi.update).mockResolvedValue({
      ...mockProducts[0],
      name: 'Updated Product',
      price: 150.0
    })

    renderWithRouter(<Products />)

    // Act: Edit product
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit'))
    })

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Product Name'), {
        target: { value: 'Updated Product' }
      })
      fireEvent.change(screen.getByLabelText('Price'), {
        target: { value: '150' }
      })
      fireEvent.click(screen.getByText('Save'))
    })

    // Assert: Verify update was called
    await waitFor(() => {
      expect(productsApi.update).toHaveBeenCalledWith('1', {
        name: 'Updated Product',
        code: 'P001',
        price: 150.0,
        materials: []
      })
    })
  })

  it('should delete product when delete button clicked', async () => {
    // Arrange: Setup mocks
    const { productsApi } = await import('../services/api')
    const mockProducts = [
      {
        id: '1',
        code: 'P001',
        name: 'Product 1',
        price: 100.0,
        materials: []
      }
    ]
    
    vi.mocked(productsApi.getAll).mockResolvedValue(mockProducts)
    vi.mocked(productsApi.delete).mockResolvedValue(undefined)

    renderWithRouter(<Products />)

    // Act: Delete product
    await waitFor(() => {
      fireEvent.click(screen.getByText('Delete'))
    })

    // Confirm deletion (if there is confirmation modal)
    await waitFor(() => {
      fireEvent.click(screen.getByText('Confirm'))
    })

    // Assert: Verify delete was called
    await waitFor(() => {
      expect(productsApi.delete).toHaveBeenCalledWith('1')
    })
  })

  it('should handle raw materials in product form', async () => {
    // Arrange: Data mock including raw materials
    const { productsApi, rawMaterialsApi } = await import('../services/api')
    
    vi.mocked(productsApi.getAll).mockResolvedValue([])
    vi.mocked(rawMaterialsApi.getAll).mockResolvedValue([
      { id: '1', code: 'RM001', name: 'Raw Material 1', stockQuantity: 100, unit: 'kg', costPerUnit: 5.0 }
    ])

    renderWithRouter(<Products />)

    // Act: Open form and add raw material
    await waitFor(() => {
      fireEvent.click(screen.getByText('Add Product'))
    })

    await waitFor(() => {
      fireEvent.click(screen.getByText('+ Add Material'))
    })

    // Assert: Verify raw material was added
    await waitFor(() => {
      expect(screen.getByText('Raw Material 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument() // default quantity
    })
  })

  it('should validate required fields in product form', async () => {
    // Arrange: Data mock
    const { productsApi } = await import('../services/api')
    vi.mocked(productsApi.getAll).mockResolvedValue([])

    renderWithRouter(<Products />)

    // Act: Try to submit empty form
    await waitFor(() => {
      fireEvent.click(screen.getByText('Add Product'))
    })

    await waitFor(() => {
      fireEvent.click(screen.getByText('Save'))
    })

    // Assert: Verify validation
    await waitFor(() => {
      expect(screen.getByLabelText('Product Code')).toBeInvalid()
      expect(screen.getByLabelText('Product Name')).toBeInvalid()
      expect(screen.getByLabelText('Price')).toBeInvalid()
    })
  })
})