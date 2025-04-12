import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronLeft
      className={className}
      style={{
        ...style,
        color: "#fff",
        fontSize: "24px",
        left: "-40px",
        zIndex: 1,
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronRight
      className={className}
      style={{
        ...style,
        color: "#fff",
        fontSize: "24px",
        right: "-40px",
        zIndex: 1,
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};

interface CarouselProps {
  data: {
    id: number;
    name: string;
    specialty: string;
    description: string;
    profileImage: string;
    backgroundImage: string;
  }[];
}

export const Carousel = ({ data }: CarouselProps) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleClick = (id: number) => {
    navigate(`/course/${id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  const isSingleItem = courses.length === 1;

  return (
    <div className="py-4 px-2">
      {isSingleItem ? (
        <div 
          className="card-container split-bg-secondary cursor-pointer" 
          onClick={() => handleClick(courses[0].id)}
        >
          <div className="row no-gutters">
            <div className="col-12 col-md-4 d-flex flex-column align-items-center p-3">
              <div className="d-flex justify-content-center" style={{ width: "100px", height: "100px" }}>
                <img
                  src={courses[0].imageUrl || "https://via.placeholder.com/100"}
                  alt={courses[0].title}
                  className="profile-image rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>

              <div className="mt-3" style={{ color: "#fff", textAlign: "center" }}>
                <h4 style={{ color: "#E4823B" }}>{courses[0].title}</h4>
                <p style={{ color: "#c9c3c3" }}>{courses[0].description}</p>
              </div>
            </div>

            <div className="col-12 col-md-8 position-relative" style={{ height: "100%" }}>
              <img
                src={courses[0].imageUrl || "https://via.placeholder.com/800x400"}
                alt="background"
                className="img-fluid rounded"
                style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "8px" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Slider {...settings}>
          {courses.map((course) => (
            <div
              key={course.id}
              className="card-container split-bg-secondary cursor-pointer"
              onClick={() => handleClick(course.id)}
            >
              <div className="row no-gutters">
                <div className="col-12 col-md-4 d-flex flex-column align-items-center p-3">
                  <div className="d-flex justify-content-center" style={{ width: "100px", height: "100px" }}>
                    <img
                      src={course.imageUrl || "https://via.placeholder.com/100"}
                      alt={course.title}
                      className="profile-image rounded-circle"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="mt-3" style={{ color: "#fff", textAlign: "center" }}>
                    <h4 style={{ color: "#E4823B" }}>{course.title}</h4>
                    <p style={{ color: "#c9c3c3" }}>{course.description}</p>
                  </div>
                </div>

                <div className="col-12 col-md-8 position-relative" style={{ height: "100%" }}>
                  <img
                    src={course.imageUrl || "https://via.placeholder.com/800x400"}
                    alt="background"
                    className="img-fluid rounded"
                    style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "8px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};