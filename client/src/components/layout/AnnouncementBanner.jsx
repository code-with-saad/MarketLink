import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faTimes, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const AnnouncementBanner = ({ 
  message = "Spring Harvest Season is Live! Pre-order fresh organic produce from your neighborhood stalls before daily cutoff times.",
  linkText = "Explore Markets",
  linkTo = "/customer/markets"
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-forest-950 text-warm-cream border-b border-forest-800/80 px-4 py-2 text-xs sm:text-sm font-medium relative transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 mx-auto text-center sm:text-left flex-wrap justify-center">
          <span className="inline-flex items-center justify-center bg-accent-lime text-forest-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
            <FontAwesomeIcon icon={faBullhorn} className="mr-1" /> Fresh Update
          </span>
          <span className="text-warm-cream/90">{message}</span>
          {linkTo && (
            <Link
              to={linkTo}
              className="inline-flex items-center text-accent-lime hover:underline font-semibold ml-1 group"
            >
              <span>{linkText}</span>
              <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-[10px] transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement"
          className="text-warm-cream/60 hover:text-accent-lime p-1 rounded-md transition-colors cursor-pointer shrink-0"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
