import React from "react";
import GenreGrid from "../components/GenreGrid";
import TrendingMovies from "../features/Home/sections/Movies/TrendingMovies";
import PopularMovies from "../features/Home/sections/Movies/PopularMovies";
import TopRatedMovies from "../features/Home/sections/Movies/TopRatedMovies";
import PopularAnimation from "../features/Home/sections/Movies/PopularAnimation";
import PopularAnime from "../features/Home/sections/Series/PopularAnime";
import NetflixOriginals from "../features/Home/sections/Originals/NetflixOriginals";
import AmazonOriginals from "../features/Home/sections/Originals/AmazonOriginals";
import DisneyPlusOriginals from "../features/Home/sections/Originals/DisneyPlusOriginals";
import AppleTVOriginals from "../features/Home/sections/Originals/AppleTVOriginals";
import CultClassics from "../features/Home/sections/Movies/CultClassics";

function MoviesPage() {
  return (
    <div className="home-movies-container">
      <h1 className="text-3xl font-bold text-center mt-4">Movies</h1>
      <p className="text-center text-gray-600 mb-4">
        Explore a wide range of movies from different genres.
      </p>
      <GenreGrid />
      <PopularMovies />
      <TrendingMovies />
      <TopRatedMovies />
      <CultClassics />
      <PopularAnimation />
      <NetflixOriginals mediaType="movie"/>
      <AmazonOriginals mediaType="movie"/>
      <DisneyPlusOriginals mediaType="movie"/>
      <AppleTVOriginals mediaType="movie"/>
      <PopularAnime />
    </div>
  );
}

export default MoviesPage;
