const DEFAULT_API_BASE_URL = "https://abhi-rjbc.onrender.com/api";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getBooks(page = 1, limit = 5) {
  return request(`/books?page=${page}&limit=${limit}`);
}

export function getBook(id) {
  return request(`/books/${id}`);
}

export function createBook(payload) {
  return request("/books", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateBook(id, payload) {
  return request(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteBook(id) {
  return request(`/books/${id}`, {
    method: "DELETE"
  });
}
