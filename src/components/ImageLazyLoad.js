import React, { Suspense } from "react";
import { unstable_createResource } from "react-cache";

const cache = {};
const generatePlaceholder = (ratio, color) => {
  const width = 1;
  const height = ratio;
  const key = `${ratio},${color}`;

  if (!cache[key]) {
    cache[key] = `data:image/svg+xml;base64, ${window.btoa(
      `<svg height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${width}" height="${height}" fill="${color}"/>
      </svg>`
    )}`;
  }

  return cache[key];
};

const ImageResource = unstable_createResource(
  src =>
    new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
    })
);

const OriImg = ({ src, alt }) => {
  ImageResource.read(src);

  return <img src={src} alt={alt} />;
};

const LazyLoadImg = ({ src, alt, ratio }) => {
  const placeholder = generatePlaceholder(ratio, "black");

  return (
    <Suspense fallback={<img src={placeholder} alt={alt} />}>
      <OriImg src={src} alt={alt} />
    </Suspense>
  );
};

export default LazyLoadImg;
