Aclaración: ** Correciones de errores y validaciones ()**

Catálogo de Productos - Aplicación Web React Este repositorio contiene una aplicación web tipo Catálogo de Productos, desarrollada en React.js. El objetivo principal fue construir una herramienta eficiente para la gestión de un inventario de productos, destacar el diseño para el poco tiempo, je.

Implementación y Funcionalidades Clave

El proyecto se diseñó para cumplir con los siguientes puntos críticos, logrando un conjunto de funcionalidades sólidas:

Gestión CRUD Completa:

Creación: Integración de un formulario intuitivo para la inserción de nuevos productos con validación de datos.

Lectura: Presentación de la información a través de una tabla paginada y ordenable.

Actualización: Funcionalidad de edición in-situ, permitiendo modificar registros existentes de manera fluida.

Eliminación: Mecanismo directo para la baja de productos individuales.

Persistencia de Datos (Local Storage): La aplicación implementa persistencia de datos mediante la API de localStorage del navegador. Esto asegura que el estado del catálogo se mantenga entre sesiones, incluso tras el cierre de la aplicación. Para una gestión modular y reusable de esta característica, se desarrolló un Hook personalizado (useLocalStorage).

Paginación del Conjunto de Datos: Para optimizar la experiencia de usuario con grandes volúmenes de datos, se incorporó un sistema de paginación que limita la visualización a un número configurable de productos por página. Esto se complementa con controles de navegación intuitivos.

Ordenamiento Dinámico: Se ofrece la capacidad de ordenar la lista de productos por nombre (ascendente o descendente), lo que mejora significativamente la capacidad de búsqueda y análisis de datos. Se incluye una opción para restablecer el orden inicial.

Arquitectura y Diseño UI/UX:

La interfaz de usuario se construyó exclusivamente con React-Bootstrap, utilizando sus clases y componentes para garantizar un diseño responsivo y una estética profesional.

El código se estructura de forma modular, dividiendo la lógica en componentes (ProductForm, ProductList, Pagination) y encapsulando lógicas complejas en Hooks, lo que favorece la mantenibilidad y escalabilidad.

Validación de Formularios: Se implementaron validaciones client-side en el formulario de ingreso de productos para asegurar la integridad de los datos.

Pruebas Unitarias: Se incluyen pruebas unitarias básicas para los componentes críticos (ProductList.test.js, ProductForm.test.js), utilizando Jest y React Testing Library para validar el comportamiento esperado.

Stack Tecnológico

React.js: Core de la aplicación.

React-Bootstrap: Framework de UI y componentes.

Bootstrap CSS: Estilos base y sistema de grid.

JavaScript (ES6+): Lógica de programación.

HTML5 / CSS3: Estructura y presentación.

Local Storage API: Mecanismo de persistencia de datos.

Jest: Framework de testing.

React Testing Library: Utilidad para testing de componentes React. Se usaron los componentes de React cuándo lo vi necesario.

Configuración y Ejecución Local

Para poner el proyecto en marcha en tu entorno de desarrollo, sigue los siguientes pasos:

Clonar el Repositorio:

Bash git clone https://github.com/EnzoBraun00/ReactWebPruebaTecnicaH2.git cd ReactWebPruebaTecnicaH2 Instalar Dependencias:

Bash npm install Ejecutar la Aplicación (Modo Desarrollo):

Bash npm start La aplicación se iniciará en http://localhost:3000/.

Ejecutar Pruebas Unitarias:

Bash npm test Interacción con la Aplicación

Boostrap npm install bootstrap react-bootstrap

Una vez desplegada localmente:

Añadir Productos: Utiliza el formulario en el panel izquierdo para ingresar datos y haz clic en "Añadir Producto".

Editar Productos: Selecciona "Editar" en la fila del producto deseado. El formulario se pre-llenará y podrás guardar los cambios.

Eliminar Productos: Usa el botón "Eliminar" junto al producto correspondiente en la tabla.

Conectar con Vercel:

npm install -g vercel

vercel login

npm run build

vercel

Y

✅ Production: https://react-prueba-tecnica-h2-9e2drlbiv-enzo-braun-s-projects.vercel.app

Navegación y Ordenamiento: La tabla soporta paginación y ordenamiento por nombre (A-Z, Z-A, o reset) mediante los controles ubicados sobre ella.

Espero guste, Gracias por la oportunidad, slds, y tengo otro mientras me queda tiempo para hacer, pero con api
