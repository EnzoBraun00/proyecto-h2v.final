// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

// Hook personalizado para manejar el estado persistente en localStorage
function useLocalStorage(key, initialValue) {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Intenta obtener el valor de localStorage si ya existe
      const item = window.localStorage.getItem(key);
      // Parsea el JSON almacenado o devuelve el valor inicial
      const parsedItem = item ? JSON.parse(item) : initialValue;

      // Asegurar que todos los elementos cargados tengan un ID
      if (Array.isArray(parsedItem)) {
        return parsedItem.map(product => {
          // Si el producto no tiene un ID o su ID es null/undefined, le asignamos uno nuevo.
          // Uso Date.now() + Math.random() para una mayor probabilidad de unicidad.
          if (product && (product.id === undefined || product.id === null)) {
            return { ...product, id: Date.now() + Math.random() };
          }
          return product; // Devuelve el producto tal cual si ya tiene un ID
        });
      }

      return parsedItem;
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return initialValue;
    }
  });

  // useEffect para actualizar localStorage cada vez que el valor cambia
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error al escribir en localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
