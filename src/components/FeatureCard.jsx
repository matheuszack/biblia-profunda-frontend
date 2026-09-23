import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeatureCard({
  icon,
  title,
  description,
  action,
  to,
}) {
  const navigate = useNavigate();

  return (
    <div className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <button className="card-action" onClick={() => navigate(to)}>
        {action}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

export default FeatureCard;