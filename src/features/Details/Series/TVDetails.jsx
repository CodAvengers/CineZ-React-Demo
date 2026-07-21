import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTvDetails } from "../../../api";
import {
  CastList,
  DetailsHero,
  DetailsPageSkeleton,
  DetailsSection,
  DetailsShell,
  EmbedPlayer,
  EpisodePanel,
  ServerSwitcher,
  useMediaDetails,
  usePlaybackProvider,
  useTvSeasonEpisodes,
} from "../shared";

const TVDetails = () => {
  const { id } = useParams();
  const { data: series, loading, error, cast } = useMediaDetails(
    id,
    getTvDetails,
    { fallbackError: "TMDB data not found" }
  );

  const seasons = series?.seasons || [];
  const [seasonOverride, setSeasonOverride] = useState(null);

  useEffect(() => {
    setSeasonOverride(null);
  }, [id]);

  const selectedSeason = seasonOverride ?? seasons[0]?.seasonNumber ?? null;

  const { episodes, selectedEpisode, setSelectedEpisode } = useTvSeasonEpisodes(
    id,
    selectedSeason,
    Boolean(series && selectedSeason)
  );

  const { providers, providerId, setProviderId, embedUrl } = usePlaybackProvider({
    mediaType: "tv",
    id,
    season: selectedSeason,
    episode: selectedEpisode,
  });

  const selectedEpisodeData = episodes.find(
    (ep) => ep.episodeNumber === selectedEpisode
  );

  if (loading) return <DetailsPageSkeleton />;
  if (error) {
    return (
      <DetailsShell>
        <div className="details-status details-status--error">Error: {error}</div>
      </DetailsShell>
    );
  }
  if (!series) {
    return (
      <DetailsShell>
        <div className="details-status details-status--error">Series not found</div>
      </DetailsShell>
    );
  }

  const counts = [
    series.seasonCount ? `${series.seasonCount} seasons` : null,
    series.episodeCount ? `${series.episodeCount} episodes` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <DetailsShell backdropUrl={series.backdropUrl} backdropAlt={series.title}>
      <DetailsHero
        title={series.title}
        meta={[
          series.firstAirDate?.split("-")[0],
          series.episodeRuntime ? `${series.episodeRuntime}m` : null,
          series.genres,
          series.status,
        ]}
        rating={series.rating}
        credit={
          series.creator ? (
            <>
              <strong>Created by</strong> {series.creator}
            </>
          ) : counts ? (
            counts
          ) : null
        }
      />

      <div className="details-player-wrap">
        <ServerSwitcher
          providers={providers}
          value={providerId}
          onChange={setProviderId}
        />
        <EmbedPlayer
          src={embedUrl}
          frameKey={`${providerId}-${id}-${selectedSeason}-${selectedEpisode}`}
          title={`${series.title} Player`}
        />
      </div>

      <EpisodePanel
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={setSeasonOverride}
        episodes={episodes}
        selectedEpisode={selectedEpisode}
        onEpisodeChange={setSelectedEpisode}
        episode={selectedEpisodeData}
      />

      <DetailsSection title="Overview">
        <p>{series.overview || "No overview available."}</p>
      </DetailsSection>

      <CastList cast={cast} />
    </DetailsShell>
  );
};

export default TVDetails;
