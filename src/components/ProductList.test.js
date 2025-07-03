import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';

describe('ProductList', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', price: '1200', supplierEmail: 'a@example.com', entryDate: '2023-01-01' },
    { id: 2, name: 'Mouse', price: '25', supplierEmail: 'b@example.com', entryDate: '2023-01-02' },
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  test('renders product list correctly', () => {
    render(
      <ProductList
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Verifica que los nombres de los productos estén en el documento
    expect(screen.getByText(/Laptop/i)).toBeInTheDocument();
    expect(screen.getByText(/Mouse/i)).toBeInTheDocument();

    // Verifica que los botones de acción estén presentes
    const editButtons = screen.getAllByText(/Editar/i);
    const deleteButtons = screen.getAllByText(/Eliminar/i);
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <ProductList
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getAllByText(/Editar/i)[0]; // Obtiene el primer botón de editar
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <ProductList
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getAllByText(/Eliminar/i)[0]; // Obtiene el primer botón de eliminar
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProducts[0].id);
  });

  test('displays "No hay productos" message when product list is empty', () => {
    render(
      <ProductList
        products={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/No hay productos en esta página./i)).toBeInTheDocument();
  });
});