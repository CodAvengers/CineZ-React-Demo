import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import TVDetailsPage from "./pages/TVDetailsPage";
import ViewAllPage from "./pages/ViewAllPage/ViewAllPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound/NotFound";
import MoviesPage from "./pages/MoviesPage";
import TvPage from "./pages/TvPage";
import ScrollToTop from "./features/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="movie/:id" element={<MovieDetailsPage />} />
          <Route path="tv/:id" element={<TVDetailsPage />} />
          <Route path="view-all/:section" element={<ViewAllPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="tv-shows" element={<TvPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
