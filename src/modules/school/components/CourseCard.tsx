import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    level?: string;
    moduleName?: string;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="card bg-dark text-white rounded-lg overflow-hidden cursor-pointer h-100"
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <img
        src={course.imageUrl || "https://via.placeholder.com/300x200"}
        alt={course.title}
        className="card-img-top img-fluid"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{course.title}</h5>
        {course.level && <span className="badge bg-warning text-dark mb-2">{course.level}</span>}
        {course.moduleName && <p className="text-muted small mb-1">{course.moduleName}</p>}
        <p className="card-text">{course.description}</p>
      </div>
    </div>
  );
}