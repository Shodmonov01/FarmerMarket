// src/api/products
import apiRequest from '.';

interface Product {
  id: number;
  name: string;
  category_id: number;
  owner_id: number;
}

interface Category {
  id: number;
  name: string;
}

// Список категорий
export const getCategories = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<Category[]>('/api/shop/categories/', 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Список продуктов
export const getProducts = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<Product[]>('/api/shop/products/', 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Продукты по категории
export const getProductsByCategory = async (categoryId: number) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<Product[]>(`/api/shop/products/category/${categoryId}/`, 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Продукты по владельцу
export const getProductsByOwner = async (ownerId: number) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<Product[]>(`/api/shop/products/owner/${ownerId}/`, 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Получение продукта по ID
export const getProductById = async (productId: number) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<Product>(`/api/shop/products/${productId}/`, 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};