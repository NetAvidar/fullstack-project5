import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import TodosPage from "./pages/TodosPage";
import PostsPage from "./pages/PostsPage";
import AlbumsPage from "./pages/AlbumsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/todos" element={<TodosPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/albums" element={<AlbumsPage />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}
export default App;
