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
// export const getProducts = async () => {
//   const accessToken = localStorage.getItem('access_token');
//   if (!accessToken) {
//     throw new Error('Access token not found in localStorage');
//   }

//   return apiRequest<Product[]>('/api/shop/products/', 'GET', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };

// Новый универсальный вариант getProducts
export const getProducts = async (url: string = '/api/shop/products/') => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  // Удаляем https://shop2.ibosh-dev.uz, если оно есть
  const cleanedUrl = url.replace(/^https?:\/\/[^/]+/, '');

  return apiRequest(cleanedUrl, 'GET', {
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
// export const getProductsByOwner = async (ownerId: number) => {
//   const accessToken = localStorage.getItem('access_token');
//   if (!accessToken) {
//     throw new Error('Access token not found in localStorage');
//   }

//   return apiRequest<Product[]>(`/api/shop/products/owner/${ownerId}/`, 'GET', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };

export const getProductsByOwner = async (ownerId: number, page = 1) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<PaginatedResponse<ProductDetail>>(
    `/api/shop/products/owner/${ownerId}/?page=${page}`,
    'GET',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
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