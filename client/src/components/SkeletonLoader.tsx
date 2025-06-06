import React from 'react';

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  rounded?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
                                                         height = 'h-4',
                                                         width = 'w-full',
                                                         rounded = 'rounded-md',
                                                       }) => {
  return (
    <div
      className={`bg-gray-300 dark:bg-gray-700 animate-pulse ${height} ${width} ${rounded} rounded-md`}
    ></div>
  );
};

export default SkeletonLoader;
