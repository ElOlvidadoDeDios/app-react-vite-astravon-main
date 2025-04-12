import { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";

interface Reel {
  id: number;
  src: string;
  title: string;
  profile: string;
  username: string;
}

const reels: Reel[] = [
  {
    id: 1,
    src: "https://www.pexels.com/download/video/856048/",
    title: "Reel 1",
    profile:
      "https://media.licdn.com/dms/image/v2/D4D03AQHxDqmg11oz7A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1693841936221?e=2147483647&v=beta&t=MRXBHOp2DBxPoX9RgoR085MWVs95K2hMU_Jvu5p_yP4",
    username: "Jheyson Jhair Arone",
  },
  {
    id: 2,
    src: "https://www.pexels.com/download/video/857195/",
    title: "Reel 2",
    profile:
      "https://weremote.net/wp-content/uploads/2022/08/mujer-sonriente-apunta-arriba.jpg",
    username: "Fany Pizarro",
  },
  {
    id: 3,
    src: "https://www.pexels.com/download/video/856050/",
    title: "Reel 3",
    profile:
      "https://static01.nyt.com/images/2017/05/07/arts/07GAL-GADOTweb/07GAL-GADOTweb-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
    username: "Xiomy Q",
  },
  {
    id: 4,
    src: "https://www.pexels.com/download/video/857193/",
    title: "Reel 4",
    profile:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0Ov8Z5u9VoKetj2Q13AoBAfS0NkE8mQRxg&s",
    username: "Iris Gutierrez",
  },
  {
    id: 5,
    src: "https://www.pexels.com/download/video/856048/",
    title: "Reel 1",
    profile:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWxOnG-G5wyoiITy9QM3idSpkhzfIryuUVDQ&s",
    username: "Lina Margoth asdas adas",
  },
  {
    id: 6,
    src: "https://www.pexels.com/download/video/857195/",
    title: "Reel 2",
    profile:
      "https://media.licdn.com/dms/image/v2/C4E12AQFeeYmiSO1VCg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1620671604228?e=2147483647&v=beta&t=a1BKzhA9tWyaVw3ZPzk_6bR7UlnZPWVEWBNQRWJkpLU",
    username: "Fany Pizarro",
  },
  {
    id: 7,
    src: "https://www.pexels.com/download/video/856050/",
    title: "Reel 3",
    profile:
      "https://fotografias.antena3.com/clipping/cmsimages01/2020/07/21/50A45B0A-59A5-4693-ABFE-CBC7FE467909.png",
    username: "Xiomy Q",
  },  {
    id: 8,
    src: "https://www.pexels.com/download/video/857195/",
    title: "Reel 2",
    profile:
      "https://media.licdn.com/dms/image/v2/C4E12AQFeeYmiSO1VCg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1620671604228?e=2147483647&v=beta&t=a1BKzhA9tWyaVw3ZPzk_6bR7UlnZPWVEWBNQRWJkpLU",
    username: "Fany Pizarro",
  },
  {
    id: 9,
    src: "https://www.pexels.com/download/video/856050/",
    title: "Reel 3",
    profile:
      "https://fotografias.antena3.com/clipping/cmsimages01/2020/07/21/50A45B0A-59A5-4693-ABFE-CBC7FE467909.png",
    username: "Xiomy Q",
  },
];

export function ReelsCarousel() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const reelsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (reelsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          reelsContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    checkScroll();
    reelsContainerRef.current?.addEventListener("scroll", checkScroll);
    return () =>
      reelsContainerRef.current?.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollLeft = () => {
    reelsContainerRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    reelsContainerRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className="reels-wrapper position-relative">
      {canScrollLeft && (
        <button className="scroll-btn left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
      )}

      <div
        className="reels-container d-flex gap-3 overflow-auto"
        ref={reelsContainerRef}
      >
        <div className="reel-item create-story">
          <div className="story-overlay">
            <FaPlus className="plus-icon" />
          </div>
          <p className="text-center mt-2">Crear historia</p>
        </div>

        {reels.map((reel) => (
          <div
            key={reel.id}
            className="reel-item"
            onClick={() => setSelectedVideo(reel.src)}
          >
            <div className="profile-circle">
              <img src={reel.profile} alt="Perfil" />
            </div>
            <video src={reel.src} className="reel-video" muted />
            <p className="username">{reel.username}</p>
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button className="scroll-btn right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      )}

      <Modal
        show={selectedVideo !== null}
        onHide={() => setSelectedVideo(null)}
        centered
      >
        <Modal.Body className="p-0">
          {selectedVideo && (
            <div className="reel-modal-content">
              <div className="reel-header">
                <img
                  src={reels.find((r) => r.src === selectedVideo)?.profile}
                  alt="Perfil"
                  className="profile-image"
                />
                <span className="username-text">
                  {reels.find((r) => r.src === selectedVideo)?.username}
                </span>
              </div>

              <video
                src={selectedVideo}
                controls
                autoPlay
                className="reel-video-modal"
              ></video>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
