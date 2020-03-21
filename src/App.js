import React from "react";
import ImageLazyLoad from "./components/ImageLazyLoad";
import "./App.css";

const images = [
  {
    title: "Photo by Sebastian Voortman from Pexels",
    link: "https://www.pexels.com/photo/beach-dawn-dusk-ocean-189349/",
    src: "./beach-dawn-dusk-ocean-189349.jpg",
    ratio: 0.67,
    alt: "Body of Water during Golden Hour"
  },
  {
    title: "Photo by Pixabay from Pexels",
    link:
      "https://www.pexels.com/photo/seashore-under-white-and-blue-sky-during-sunset-210205/",
    src: "./seashore-under-white-and-blue-sky-during-sunset-210205.jpg",
    ratio: 0.67,
    alt: "Seashore Under White and Blue Sky during Sunset"
  },
  {
    title: "Photo by Kellie Churchman from Pexels",
    link:
      "https://www.pexels.com/photo/landscape-photograph-of-body-of-water-1001682/",
    src: "./landscape-photograph-of-body-of-water-1001682.jpg",
    ratio: 0.67,
    alt: "Landscape Photograph of Body of Water"
  },
  {
    title: "Photo by Pok Rie from Pexels",
    link: "https://www.pexels.com/photo/seaport-during-daytime-132037/",
    src: "./seaport-during-daytime-132037.jpg",
    ratio: 0.67,
    alt: "Seaport during Daytime"
  }
];

function App() {
  return (
    <div>
      <h2>With Suspense</h2>
      <div className="gallery">
        {images.map(({ title, src, alt, ratio }, index) => (
          <figure key={index}>
            <ImageLazyLoad src={src} alt={alt} ratio={ratio} />
            <figcaption>{title}</figcaption>
          </figure>
        ))}
      </div>
      <h2>Without Suspense</h2>
      <div className="gallery">
        {images.map(({ title, src, alt }, index) => (
          <figure key={index}>
            <img src={src} alt={alt} />
            <figcaption>{title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default App;
