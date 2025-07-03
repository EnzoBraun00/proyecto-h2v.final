import React, { useState, useMemo } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Pagination from './components/Pagination';
import useLocalStorage from './hooks/useLocalStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ButtonGroup, Button, Container, Row, Col, Card } from 'react-bootstrap';

function App() {
  const [products, setProducts] = useLocalStorage('products', []);
  const [editingProduct, setEditingProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];

    if (sortOrder === 'asc') {
      sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sortableProducts;
  }, [products, sortOrder]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Volver a la primera página al cambiar el orden
  };

  const addOrUpdateProduct = (product) => {
    setProducts((prevProducts) => {
      if (product.id) {
        // Modo edición: actualiza el producto existente
        return prevProducts.map((p) => (p.id === product.id ? product : p));
      } else {
        // Modo añadir: agrega un nuevo producto con un ID
        return [...prevProducts, { ...product, id: Date.now() }];
      }
    });
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter((product) => product.id !== id);
      const totalPages = Math.ceil(updatedProducts.length / productsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (updatedProducts.length === 0) {
        setCurrentPage(1);
      }
      return updatedProducts;
    });
  };

  const editProduct = (product) => {
    setEditingProduct(product);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  // Lista de nombres de productos existentes.
  const existingProductNames = useMemo(() => products.map(p => p.name), [products]);

  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center text-primary">
        <i className="bi bi-box-seam me-2"></i>
        Catálogo de Productos
      </h1>
      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white py-3">
              <h2 className="mb-0 fs-5">{editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h2>
            </Card.Header>
            <Card.Body>
              <ProductForm
                onSubmit={addOrUpdateProduct}
                productToEdit={editingProduct}
                onCancelEdit={cancelEditing}
                existingProductNames={existingProductNames}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 fs-5">Listado de Productos</h2>
              <ButtonGroup aria-label="Order products">
                <Button
                  variant={sortOrder === 'asc' ? 'primary' : 'outline-primary'}
                  onClick={() => handleSort('asc')}
                  size="sm"
                >
                  <i className="bi bi-sort-alpha-down"></i> A-Z
                </Button>
                <Button
                  variant={sortOrder === 'desc' ? 'primary' : 'outline-primary'}
                  onClick={() => handleSort('desc')}
                  size="sm"
                >
                  <i className="bi bi-sort-alpha-up"></i> Z-A
                </Button>
                <Button
                  variant={sortOrder === 'none' ? 'secondary' : 'outline-secondary'}
                  onClick={() => handleSort('none')}
                  size="sm"
                >
                  <i className="bi bi-arrow-clockwise"></i> Reset
                </Button>
              </ButtonGroup>
            </Card.Header>
            <Card.Body>
              {products.length === 0 ? (
                <p className="text-muted text-center py-4">No hay productos registrados aún.</p>
              ) : (
                <>
                  <ProductList
                    products={currentProducts}
                    onEdit={editProduct}
                    onDelete={deleteProduct}
                  />
                  <Pagination
                    productsPerPage={productsPerPage}
                    totalProducts={products.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;