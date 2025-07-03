import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function ProductForm({ onSubmit, productToEdit, onCancelEdit, existingProductNames = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    supplierEmail: '',
    entryDate: '',
    id: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        price: productToEdit.price !== undefined && productToEdit.price !== null
               ? String(productToEdit.price)
               : '',
        supplierEmail: productToEdit.supplierEmail || '',
        entryDate: productToEdit.entryDate || '',
        id: productToEdit.id,
      });
    } else {
      setFormData({
        name: '',
        price: '',
        supplierEmail: '',
        entryDate: '',
        id: null,
      });
    }
    setErrors({});
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'price') {
      const stringValue = String(value);

      // Limitar a 7 dígitos numéricos
      const digitsOnly = stringValue.replace(/[^0-9]/g, '');
      if (digitsOnly.length > 7 && stringValue !== '') {
        return;
      }

      // No permitir valores negativos o cero
      const numValue = parseFloat(stringValue);
      if (stringValue === '') { 
        setFormData((prevData) => ({ ...prevData, [name]: stringValue }));
      } else if (isNaN(numValue) || numValue < 0) {
        setFormData((prevData) => ({ ...prevData, [name]: '0' }));
      } else if (numValue === 0 && stringValue.trim() !== '') {
        setFormData((prevData) => ({ ...prevData, [name]: '0' }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: stringValue }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const validate = () => {
    let newErrors = {};
    const priceAsString = String(formData.price);
    const parsedPrice = parseFloat(priceAsString);
    const currentNameTrimmed = String(formData.name).trim().toLowerCase();
    const supplierEmailTrimmed = String(formData.supplierEmail).trim();
    const entryDateTrimmed = String(formData.entryDate).trim();


    // Validación de nombre
    if (!currentNameTrimmed) {
      newErrors.name = 'El nombre del producto es obligatorio.';
    } else {
      const isActuallyDuplicate = existingProductNames.some(existingName => {
          const lowerCaseExistingName = existingName.toLowerCase();
          // Solo es un duplicado si:
          // 1. El nombre actual (lowercase) coincide con un nombre existente (lowercase)
          // 2. Y se esta en modo añadir (no hay productToEdit).
          //
          // 3. Sino si estamos en modo editar, pero el nombre existente NO es el nombre original del producto que estamos editando
          return lowerCaseExistingName === currentNameTrimmed && (productToEdit ? productToEdit.name.toLowerCase() !== currentNameTrimmed : true);
      });

      if (isActuallyDuplicate) {
        newErrors.name = 'Ya existe un producto con este nombre.';
      }
    }

    // Validación de precio
    if (!priceAsString.trim()) {
      newErrors.price = 'El precio es obligatorio.';
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0.';
    }

    // Validación de correo
    if (!supplierEmailTrimmed) {
      newErrors.supplierEmail = 'El correo del proveedor es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(supplierEmailTrimmed)) {
      newErrors.supplierEmail = 'El correo del proveedor no es válido.';
    }

    // Validación de fecha
    if (!entryDateTrimmed) {
      newErrors.entryDate = 'La fecha de ingreso es obligatoria.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
      });
      if (!productToEdit) {
        setFormData({
          name: '',
          price: '',
          supplierEmail: '',
          entryDate: '',
          id: null, //Resetear el ID también al añadir uno nuevo
        });
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formProductName">
        <Form.Label>Nombre del Producto</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
          maxLength={30}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formProductPrice">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          isInvalid={!!errors.price}
          min="1"
        />
        <Form.Control.Feedback type="invalid">
          {errors.price}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formSupplierEmail">
        <Form.Label>Correo del Proveedor</Form.Label>
        <Form.Control
          type="email"
          name="supplierEmail"
          value={formData.supplierEmail}
          onChange={handleChange}
          isInvalid={!!errors.supplierEmail}
          maxLength={50}
        />
        <Form.Control.Feedback type="invalid">
          {errors.supplierEmail}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEntryDate">
        <Form.Label>Fecha de Ingreso</Form.Label>
        <Form.Control
          type="date"
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
          isInvalid={!!errors.entryDate}
        />
        <Form.Control.Feedback type="invalid">
          {errors.entryDate}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid gap-2 d-md-block mt-4">
        <Button
          variant="primary"
          type="submit"
          className="me-md-2 mb-2 mb-md-0"
        >
          {productToEdit ? 'Guardar Cambios' : 'Añadir Producto'}
        </Button>
        {productToEdit && (
          <Button variant="secondary" onClick={onCancelEdit}>
            Cancelar Edición
          </Button>
        )}
      </div>
    </Form>
  );
}

export default ProductForm;