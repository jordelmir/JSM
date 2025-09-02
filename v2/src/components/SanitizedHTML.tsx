import React, { useMemo } from 'react'; // Import useMemo
import DOMPurify from 'dompurify';

/**
 * Props for the SanitizedHTML component.
 */
interface SanitizedHTMLProps {
  /**
   * The HTML string to be sanitized and rendered.
   */
  html: string;
}

/**
 * A component that safely renders HTML content by sanitizing it using DOMPurify.
 * It prevents XSS attacks by stripping potentially malicious code.
 * The sanitization process is memoized for performance optimization.
 */
const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html }) => {
  // Memoize the sanitized HTML to prevent re-sanitization on every render
  // if the 'html' prop has not changed.
  const sanitizedHTML = useMemo(() => DOMPurify.sanitize(html), [html]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default SanitizedHTML;
