import React from "react";
import GenreGrid from "../components/GenreGrid";
import PopularSeries from "../features/Home/sections/Series/PopularSeries";
import TrendingSeries from "../features/Home/sections/Series/TrendingSeries";
import TopRatedSeries from "../features/Home/sections/Series/TopRatedSeries";
import PopularAnime from "../features/Home/sections/Series/PopularAnime";
import NetflixOriginals from "../features/Home/sections/Originals/NetflixOriginals";
import AmazonOriginals from "../features/Home/sections/Originals/AmazonOriginals";
import HBOOriginals from "../features/Home/sections/Originals/HBOOriginals";
import DisneyPlusOriginals from "../features/Home/sections/Originals/DisneyPlusOriginals";
import AppleTVOriginals from "../features/Home/sections/Originals/AppleTVOriginals";
import AiringTodaySeries from "../features/Home/sections/Series/AiringTodaySeries";

function TvPage() {
  return (
    <div className="home-movies-container">
      <h1 className="text-3xl font-bold text-center mt-4">Movies</h1>
      <p className="text-center text-gray-600 mb-4">
        Explore a wide range of movies from different genres.
      </p>
      <GenreGrid type="tv"/>
      <TrendingSeries />
      <TopRatedSeries />
      <NetflixOriginals mediaType="tv" />
      <AmazonOriginals mediaType="tv" />
      <HBOOriginals mediaType="tv" />
      <DisneyPlusOriginals mediaType="tv" />
      <AppleTVOriginals mediaType="tv" />
      <PopularAnime />
      <AiringTodaySeries />
      <PopularSeries />
    </div>
  );
}

export default TvPage;
