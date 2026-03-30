import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const subtitle =
    location.pathname === "/"
      ? "Track, create, and manage book records"
      : "Use the form below to create or update a book";

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">MERN Machine Test</p>
          <h1>Books Dashboard</h1>
          <p className="hero-copy">{subtitle}</p>
        </div>
        <Link className="primary-link" to={location.pathname === "/" ? "/books/new" : "/"}>
          {location.pathname === "/" ? "Add New Book" : "Back to List"}
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
