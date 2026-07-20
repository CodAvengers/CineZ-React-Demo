import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTrendingThisWeek } from "../../../../api";

const TrendingThisWeek = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items } = await getTrendingThisWeek();
        setTrending(items);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="section-container">
      <Grid
        title="Trending This Week"
        data={trending}
        loading={loading}
        onItemClick={(item) =>
          navigate(`/${item.mediaType === "movie" ? "movie" : "tv"}/${item.id}`)
        }
        mediaType="mixed"
      />
    </div>
  );
};

export default TrendingThisWeek;
