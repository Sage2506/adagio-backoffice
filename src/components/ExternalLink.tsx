// src/components/ExternalLink.tsx
import { trackExternalLink } from '../lib/analytics';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  trackLabel?: string;
  style?: React.CSSProperties;
}

const ExternalLink = ({ 
  href, 
  children, 
  className = '', 
  trackLabel,
  style
}: ExternalLinkProps) => {
  const handleClick = () => {
    trackExternalLink(href, trackLabel || children?.toString());
  };

  return (
    <a 
      href={href} 
      className={className}
      onClick={handleClick}
      target="_blank" 
      rel="noopener noreferrer"
      style={style}
    >
      {children}
    </a>
  );
};

export default ExternalLink;