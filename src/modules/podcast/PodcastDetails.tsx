import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from "@mui/material";
import { MdExpandMore } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";

interface PodcastEpisode {
  id: number;
  title: string;
  description: string;
  audio_url: string;
  duration: string;
  episode_number: number;
  publish_date: string;
}

interface PodcastProgram {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

const API_URL = 'http://localhost:3001';

export default function PodcastDetail() {
  const { category } = useParams();
  const location = useLocation();
  const [program, setProgram] = useState<PodcastProgram | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedParent, setExpandedParent] = useState<boolean>(true);
  const [expandedChild, setExpandedChild] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Primero buscar el programa por categoría
        const programsRes = await fetch(`${API_URL}/api/podcasts/programs`);
        if (!programsRes.ok) throw new Error('Error al cargar programas');
        const programsData = await programsRes.json();
        
        const foundProgram = programsData.find((p: PodcastProgram) => p.category === category);
        if (!foundProgram) throw new Error('Programa no encontrado');
        
        setProgram(foundProgram);
        
        // Luego cargar los episodios del programa
        const episodesRes = await fetch(`${API_URL}/api/podcasts/episodes`);
        if (!episodesRes.ok) throw new Error('Error al cargar episodios');
        const episodesData = await episodesRes.json();
        
        const programEpisodes = episodesData.filter((e: PodcastEpisode) => e.program_id === foundProgram.id);
        setEpisodes(programEpisodes);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleChildAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedChild(isExpanded ? panel : null);
  };

  const handlePlayPause = (audioSrc: string, trackId: number) => {
    if (currentAudio) {
      currentAudio.pause();
      if (playingTrack === trackId) {
        setPlayingTrack(null);
        return;
      }
    }

    const newAudio = new Audio(audioSrc);
    newAudio.play();
    setCurrentAudio(newAudio);
    setPlayingTrack(trackId);
  };

  if (loading || !program) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content p-4 text-white rounded-lg flex gap-4">
      <h6 className="mb-0 text-uppercase text-white">
        Programas que podría gustarte
      </h6>
      <hr />
      <div className="row">
        <div className="col-12 col-md-1 d-flex flex-column align-items-center">
          <img
            src={program.image_url}
            alt={program.title}
            className="rounded-circle"
            style={{ width: "90px", height: "90px", objectFit: "cover" }}
          />
        </div>

        <div className="col-12 col-md-11">
          <Accordion
            expanded={expandedParent}
            onChange={() => setExpandedParent(!expandedParent)}
            sx={{ backgroundColor: "#232321", color: "white" }}
          >
            <AccordionSummary
              expandIcon={<MdExpandMore className="text-white h3" />}
              sx={{ backgroundColor: "#2C2C2C", color: "white" }}
            >
              <div>
                <Typography className="font-bold text-lg text-uppercase">
                  {program.title}
                </Typography>
                <Typography className="text-sm text-gray-300">
                  {program.description}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#1F1F1F", color: "white" }}>
              {episodes.length > 0 ? (
                episodes.map((episode, index) => (
                  <Accordion
                    key={episode.id}
                    expanded={expandedChild === index}
                    onChange={handleChildAccordionChange(index)}
                    sx={{ backgroundColor: "#232321", color: "white" }}
                  >
                    <AccordionSummary
                      expandIcon={<MdExpandMore className="text-white h4" />}
                      sx={{ backgroundColor: "#2C2C2C" }}
                    >
                      <Typography className="font-semibold">
                        {episode.title} - Episodio {episode.episode_number}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: "#1F1F1F" }}>
                      <div className="d-flex align-items-center py-2">
                        <Typography className="text-white flex-grow-1">
                          {episode.description}
                        </Typography>
                        <div className="ms-auto">
                          <IconButton
                            color="inherit"
                            className="p-2 rounded"
                            onClick={() => handlePlayPause(episode.audio_url, episode.id)}
                          >
                            {playingTrack === episode.id ? (
                              <FaPause className="text-white" />
                            ) : (
                              <FaPlay className="text-white" />
                            )}
                          </IconButton>
                        </div>
                      </div>
                      <div className="mt-2">
                        <audio 
                          src={episode.audio_url} 
                          controls 
                          className="w-100"
                          style={{ backgroundColor: "#2C2C2C" }}
                        />
                      </div>
                      <div className="text-muted small mt-2">
                        Publicado: {new Date(episode.publish_date).toLocaleDateString()} | Duración: {episode.duration}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography className="text-center py-3">
                  No hay episodios disponibles para este programa
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
}