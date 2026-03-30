import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import BookForm from "./pages/BookForm";
import BooksList from "./pages/BooksList";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BooksList />} />
        <Route path="/books/new" element={<BookForm mode="create" />} />
        <Route path="/books/:id/edit" element={<BookForm mode="edit" />} />
      </Route>
    </Routes>
  );
}
