import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createBook, getBook, updateBook } from "../lib/api";

const initialState = {
  title: "",
  author: "",
  publishedDate: ""
};

export default function BookForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !id) {
      return;
    }

    async function loadBook() {
      try {
        const book = await getBook(id);
        setForm({
          title: book.title,
          author: book.author,
          publishedDate: new Date(book.publishedDate).toISOString().slice(0, 10)
        });
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id, mode]);

  function validate(values) {
    const nextErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!values.author.trim()) {
      nextErrors.author = "Author is required";
    }

    if (!values.publishedDate) {
      nextErrors.publishedDate = "Published date is required";
    }

    return nextErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setApiError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "edit") {
        await updateBook(id, form);
      } else {
        await createBook(form);
      }

      navigate("/");
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="status">Loading book details...</p>;
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header">
        <div>
          <h2>{mode === "edit" ? "Edit Book" : "Add Book"}</h2>
          <p>All fields are required.</p>
        </div>
      </div>

      <form className="book-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label>
          Author
          <input name="author" value={form.author} onChange={handleChange} />
          {errors.author && <span className="field-error">{errors.author}</span>}
        </label>

        <label>
          Published Date
          <input type="date" name="publishedDate" value={form.publishedDate} onChange={handleChange} />
          {errors.publishedDate && <span className="field-error">{errors.publishedDate}</span>}
        </label>

        {apiError && <p className="status error">{apiError}</p>}

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Saving..." : mode === "edit" ? "Update Book" : "Create Book"}
          </button>
          <Link className="secondary-link" to="/">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
