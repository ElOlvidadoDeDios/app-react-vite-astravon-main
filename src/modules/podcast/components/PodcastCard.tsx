import React from "react";
import { Link } from "react-router-dom";

interface Podcast {
  id: number;
  title: string;
  date: string;
  duration: string;
  image: string;
  category: string;
  episodes_count?: number;
  last_updated?: string;
  total_duration?: string;
}

const PodcastCard: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
  return (
    <Link
      to={{
        pathname: `/podcast/${podcast.category }`,
      }}
      state={{ id: podcast.id, category:podcast.category}} 
      className="text-white text-decoration-none"
    >
      <div
        className="border-0 shadow-sm w-100"
        style={{ minHeight: "180px", cursor: "pointer" }}
      >
        <img
          src={podcast.image}
          alt={podcast.title}
          className="card-img-top rounded"
          style={{
            objectFit: "cover",
            height: "160px",
          }}
        />
        <div className="card-body mt-2 d-flex flex-column justify-content-between">
          <h6
            className="card-title"
            title={podcast.title}
            style={{
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "14px",
              lineHeight: "1.3em",
              height: "2.6em",
            }}
          >
            {podcast.title}
          </h6>
          <p className="card-text pt-2 text-muted small m-0">
            {podcast.date} • {podcast.duration}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;
