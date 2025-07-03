// src/components/ProductForm.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from './ProductForm';

// Mock de las funciones de callback para onSubmit y onCancelEdit
const mockOnSubmit = jest.fn();
const mockOnCancelEdit = jest.fn();

// Limpia los mocks antes de cada test para asegurar que no haya interferencias
beforeEach(() => {
  mockOnSubmit.mockClear();
  mockOnCancelEdit.mockClear();
});

describe('ProductForm', () => {
  // Test 1: Renderiza el formulario correctamente para añadir producto
  test('renders the form correctly for adding a product', () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/Nombre del Producto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo del Proveedor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Ingreso/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Añadir Producto/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Cancelar Edición/i })).not.toBeInTheDocument(); // No debe mostrar el botón de cancelar
  });

  // Test 2: Renderiza el formulario con datos de edición
  test('renders the form with product data for editing', () => {
    const product = {
      id: 1,
      name: 'Old Laptop',
      price: 900,
      supplierEmail: 'old@example.com',
      entryDate: '2023-01-01',
    };
    render(<ProductForm onSubmit={mockOnSubmit} productToEdit={product} onCancelEdit={mockOnCancelEdit} />);

    expect(screen.getByLabelText(/Nombre del Producto/i)).toHaveValue(product.name);
    expect(screen.getByLabelText(/Precio/i)).toHaveValue(product.price); // Input type="number" devuelve el valor numérico
    expect(screen.getByLabelText(/Correo del Proveedor/i)).toHaveValue(product.supplierEmail);
    expect(screen.getByLabelText(/Fecha de Ingreso/i)).toHaveValue(product.entryDate);
    expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar Edición/i })).toBeInTheDocument();
  });

  // Test 3: Llama onSubmit con los datos correctos cuando el formulario es válido
  test('calls onSubmit with correct data when form is valid', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Rellena el formulario
    fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), { target: { value: 'Laptop Gaming' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '1200' } }); // Aunque sea un string, el componente lo convierte a número
    fireEvent.change(screen.getByLabelText(/Correo del Proveedor/i), { target: { value: 'gaming@example.com' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Ingreso/i), { target: { value: '2023-11-15' } });

    // Envía el formulario
    fireEvent.click(screen.getByRole('button', { name: /Añadir Producto/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Laptop Gaming',
        price: 1200,
        supplierEmail: 'gaming@example.com',
        entryDate: '2023-11-15',
        id: null,
      });
    });
  });

  // Test 4: Muestra errores de validación para campos vacíos
  test('displays validation errors for empty fields', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /Añadir Producto/i }));

    await waitFor(() => {
      expect(screen.getByText(/El nombre del producto es obligatorio./i)).toBeInTheDocument();
      expect(screen.getByText(/El precio es obligatorio./i)).toBeInTheDocument();
      expect(screen.getByText(/El correo del proveedor es obligatorio./i)).toBeInTheDocument();
      expect(screen.getByText(/La fecha de ingreso es obligatoria./i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Test 5: Muestra error de validación para precio no numérico
  test('displays validation error for non-numeric price', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    const priceInput = screen.getByLabelText(/Precio/i);

    fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Correo del Proveedor/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Ingreso/i), { target: { value: '2023-01-01' } });

    fireEvent.change(priceInput, { target: { value: 'abc' } });

    fireEvent.click(screen.getByRole('button', { name: /Añadir Producto/i }));

    await waitFor(() => {
      expect(screen.getByText(/El precio es obligatorio./i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Test 6: Muestra error de validación para precio menor o igual a 0
  test('displays validation error for price less than or equal to 0', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '-50' } });
    fireEvent.change(screen.getByLabelText(/Correo del Proveedor/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Ingreso/i), { target: { value: '2023-01-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Añadir Producto/i }));

    await waitFor(() => {
      expect(screen.getByText(/El precio debe ser un número mayor a 0./i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Añadir Producto/i }));

    await waitFor(() => {
      expect(screen.getByText(/El precio debe ser un número mayor a 0./i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Test 7: Llama onCancelEdit al hacer clic en Cancelar Edición
  test('calls onCancelEdit when cancel button is clicked', async () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 100,
      supplierEmail: 'test@example.com',
      entryDate: '2023-01-01',
    };
    render(<ProductForm onSubmit={mockOnSubmit} productToEdit={product} onCancelEdit={mockOnCancelEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /Cancelar Edición/i }));

    await waitFor(() => {
      expect(mockOnCancelEdit).toHaveBeenCalledTimes(1);
    });
  });

  // Test 8: Los campos se vacían después de añadir un producto (confirmando el nuevo comportamiento)
  test('fields clear after adding a product', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), { target: { value: 'Nuevo Producto' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Correo del Proveedor/i), { target: { value: 'nuevo@example.com' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Ingreso/i), { target: { value: '2024-07-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Añadir Producto/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByLabelText(/Nombre del Producto/i)).toHaveValue('');
    expect(screen.getByLabelText(/Precio/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Correo del Proveedor/i)).toHaveValue('');
    expect(screen.getByLabelText(/Fecha de Ingreso/i)).toHaveValue('');
  });

  // Test 9: Los campos se llenan correctamente al entrar en modo edición y se resetean al cancelar
  test('fields populate correctly in edit mode and reset on cancel', async () => {
    const productData = {
      id: 1,
      name: 'Product A',
      price: 100,
      supplierEmail: 'a@example.com',
      entryDate: '2023-01-01',
    };

    const { rerender } = render(<ProductForm onSubmit={mockOnSubmit} productToEdit={productData} onCancelEdit={mockOnCancelEdit} />);

    expect(screen.getByLabelText(/Nombre del Producto/i)).toHaveValue('Product A');
    expect(screen.getByLabelText(/Precio/i)).toHaveValue(100);
    expect(screen.getByLabelText(/Correo del Proveedor/i)).toHaveValue('a@example.com');
    expect(screen.getByLabelText(/Fecha de Ingreso/i)).toHaveValue('2023-01-01');
    expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar Edición/i })).toBeInTheDocument();

    rerender(<ProductForm onSubmit={mockOnSubmit} productToEdit={null} onCancelEdit={mockOnCancelEdit} />);

    await waitFor(() => {
        expect(screen.getByLabelText(/Nombre del Producto/i)).toHaveValue('');
        expect(screen.getByLabelText(/Precio/i)).toHaveValue(null);
        expect(screen.getByLabelText(/Correo del Proveedor/i)).toHaveValue('');
        expect(screen.getByLabelText(/Fecha de Ingreso/i)).toHaveValue('');
    });
    expect(screen.queryByRole('button', { name: /Cancelar Edición/i })).not.toBeInTheDocument();
  });
});
