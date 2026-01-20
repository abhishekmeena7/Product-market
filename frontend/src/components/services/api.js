// Prefer absolute backend URL via env; fallback to proxy-relative path
const API_BASE = import.meta.env?.VITE_BACKEND_URL || '';
const API = `${API_BASE}/api/products`;

export const getProducts = () =>
  fetch(API).then(res => res.json());

export const createProduct = (data) =>
  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Create failed (${res.status})`);
    }
    return res.json();
  });

export const togglePublish = (id, publish) =>
  fetch(`${API}/${id}/${publish ? 'publish' : 'unpublish'}`, {
    method: 'POST'
  });

export const updateProduct = (id, data) =>
  fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Update failed (${res.status})`);
    }
    return res.json();
  });

export const deleteProduct = (id) =>
  fetch(`${API}/${id}`, { method: 'DELETE' }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Delete failed (${res.status})`);
    }
    return res.json();
  });
