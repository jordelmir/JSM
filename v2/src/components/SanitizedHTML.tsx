
import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
}

const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html }) => {
  const sanitizedHTML = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default SanitizedHTML;
