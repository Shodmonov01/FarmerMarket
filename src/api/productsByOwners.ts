// src/api/productsByOwners
import apiRequest from '.';

interface ProductDetail {
  id: number;
  name: string;
  description: string;
}

interface ProductData {
  name: string;
  description: string;
  unit_type: 'kg' | 'liter' | 'piece';
  pcs: number;
  price: number;
  images: File[]; // Массив файлов изображений
  category: number;
  owner: number;
}

// Детали продукта
export const getProductDetail = async (productId: number) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<ProductDetail>(`/shop/products/detail/${productId}/`, 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Обновление продукта
export const updateProduct = async (productId: number, productData: Partial<ProductDetail>) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<ProductDetail>(`/shop/products/detail/${productId}/`, 'PUT', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: productData,
  });
};

// Удаление продукта
export const deleteProduct = async (productId: number) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<null>(`/shop/products/detail/${productId}/`, 'DELETE', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Список продуктов владельца
// export const getOwnerProducts = async () => {
//   const accessToken = localStorage.getItem('access_token');
//   if (!accessToken) {
//     throw new Error('Access token not found in localStorage');
//   }

//   return apiRequest<ProductDetail[]>('/api/shop/products/owner/', 'GET', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };

export const getOwnerProducts = async (page = 1) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<PaginatedResponse<ProductDetail>>(`/api/shop/products/owner/?page=${page}`, 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Создание продукта
// export const createProduct = async (productData: ProductDetail) => {
//   const accessToken = localStorage.getItem('access_token');
//   if (!accessToken) {
//     throw new Error('Access token not found in localStorage');
//   }

//   return apiRequest<ProductDetail>('/shop/products/owner/', 'POST', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: productData,
//   });
// };


export const createProduct = async (productData: ProductData) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('unit_type', productData.unit_type);
  formData.append('pcs', productData.pcs.toString());
  formData.append('price', productData.price.toString());
  formData.append('category', productData.category.toString());
  // formData.append('owner', productData.owner.toString());

  productData.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image, image.name);
  });

  // Используем fetch напрямую для FormData
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/shop/products/owner/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const result: ApiResponse<ProductDetail> = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
  }

  return result;
};