import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks } from "../lib/api";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBooks(page = 1) {
    setLoading(true);
    setError("");

    try {
      const data = await getBooks(page, 5);
      setBooks(data.items);
      setPagination(data.pagination);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks(1);
  }, []);

  async function handleDelete(id) {
    const shouldDelete = window.confirm("Delete this book?");
    if (!shouldDelete) {
      return;
    }

    try {
      await deleteBook(id);
      const nextPage =
        books.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      await loadBooks(nextPage);
    } catch (apiError) {
      setError(apiError.message);
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Book Collection</h2>
          <p>{pagination.totalItems} records available</p>
        </div>
      </div>

      {loading && <p className="status">Loading books...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && books.length === 0 && (
        <div className="empty-state">
          <p>No books found yet.</p>
          <Link className="primary-link" to="/books/new">
            Create your first book
          </Link>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <article key={book._id} className="book-card">
                <div>
                  <p className="card-label">Title</p>
                  <h3>{book.title}</h3>
                </div>
                <p>
                  <span className="card-label">Author</span>
                  {book.author}
                </p>
                <p>
                  <span className="card-label">Published</span>
                  {new Date(book.publishedDate).toLocaleDateString()}
                </p>
                <div className="card-actions">
                  <Link className="secondary-link" to={`/books/${book._id}/edit`}>
                    Edit
                  </Link>
                  <button type="button" className="danger-button" onClick={() => handleDelete(book._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button
              type="button"
              onClick={() => loadBooks(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => loadBooks(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
