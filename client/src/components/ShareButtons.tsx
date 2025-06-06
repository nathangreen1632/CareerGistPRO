import React from 'react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';

interface Props {
  sourceId: string;
  title: string;
  company?: string;
  isAppliedView?: boolean;
  onRemoveApplied?: () => void;
}

export const ShareButtons: React.FC<Props> = ({
                                                sourceId,
                                                isAppliedView = false,
                                                onRemoveApplied
                                              }) => {
  const shareUrl = `https://www.careergistpro.com/share/${sourceId}`;
  const encodedUrl = encodeURIComponent(shareUrl);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <div className="flex items-center gap-3 mt-2">
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="text-white hover:text-gray-300"
      >
        <FaLinkedin size={18} />
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="text-white hover:text-gray-300"
      >
        <FaFacebook size={18} />
      </a>
      {isAppliedView && onRemoveApplied && (
        <button
          onClick={onRemoveApplied}
          className="text-md text-red-500 hover:text-red-700 ml-auto font-medium transition"
        >
          Remove
        </button>
      )}
    </div>
  );
};
