import React, { useState, useEffect } from "react";
import "./Home.css";
import GenreGrid from "../../components/GenreGrid";
import BannerHome from "../../components/Hero/BannerHome";
import TrendingMovies from "./sections/Movies/TrendingMovies";
import PopularMovies from "./sections/Movies/PopularMovies";
import TopRatedMovies from "./sections/Movies/TopRatedMovies";
import PopularSeries from "./sections/Series/PopularSeries";
import TrendingSeries from "./sections/Series/TrendingSeries";
import TopRatedSeries from "./sections/Series/TopRatedSeries";
import AiringTodaySeries from "./sections/Series/AiringTodaySeries";
import PopularAnimation from "./sections/Movies/PopularAnimation";
import PopularAnime from "./sections/Series/PopularAnime";
import NetflixOriginals from "./sections/Originals/NetflixOriginals";
import AmazonOriginals from "./sections/Originals/AmazonOriginals";
import HBOOriginals from "./sections/Originals/HBOOriginals";
import DisneyPlusOriginals from "./sections/Originals/DisneyPlusOriginals";
import AppleTVOriginals from "./sections/Originals/AppleTVOriginals";
import CultClassics from "./sections/Movies/CultClassics";

const Home = () => {
  return (
    <div className="home-movies-container">
      <BannerHome />
      <GenreGrid />
      <PopularMovies />
      <TrendingSeries />
      <TopRatedMovies />
      <TopRatedSeries />
      <TrendingMovies />
      <PopularAnimation />
      <NetflixOriginals />
      <AmazonOriginals />
      <HBOOriginals />
      <DisneyPlusOriginals />
      <AppleTVOriginals />
      <CultClassics />
      <PopularAnime />
      <AiringTodaySeries />
      <PopularSeries />
    </div>
  );
};

export default Home;
