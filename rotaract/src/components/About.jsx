import React, { useMemo } from "react";

export default function About() {
  // Using useMemo to memoize the images array
  const images = useMemo(() => {
    const tempImages = [];
    for (let i = 1; i < 17; i++) {
      tempImages.push(`/rotaract-images/image${i}.png`);
    }
    return tempImages;
  }, []); // Dependency array is empty, so it runs only once

  // Memoizing objectives since it's static data
  const objectives = useMemo(
    () => [
      "To familiarize with the Vision and Mission of Rotaract club",
      "To understand the role of youth in transforming society",
      "To be aware of the social responsibility of the youth",
      "To enable students to become responsible citizens",
      "To help students explore their role as global citizens",
    ],
    []
  );

  return (
    <div className="md:pl-8 md:max-w-[1200px] flex flex-col justify-center gap-10 mx-8 sm:mx-12 py-8 sm:py-12 text-sm md:text-base">
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">Vision</h1>
        <p className="text-sm md:text-lg text-gray-600 leading-relaxed">
          The Rotaract Club of Arul Anandar College envisions itself as a unit of an
          International Youth Organisation that supports and promotes youth to play a
          vital role in the development of society.
        </p>
      </div>

      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">Mission</h1>
        <p className="text-sm md:text-lg text-gray-600 leading-relaxed">
          Our mission is to encourage our members to become responsible citizens and
          competent leaders in the future.
        </p>
      </div>

      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">Objectives</h1>
        <ul className="list-disc pl-6 md:pl-12 space-y-2 text-sm md:text-lg text-gray-600">
          {objectives.map((point, index) => (
            <li key={index} className="leading-relaxed">{point}</li>
          ))}
        </ul>

        <p className="text-sm md:text-lg text-gray-600 leading-relaxed py-2">
          The Rotaract Club of Arul Anandar College has conducted various programs that
          are vital components of nation-building.
        </p>

        <p className="text-sm md:text-lg text-gray-600 leading-relaxed py-2">
          To familiarize with the Vision and Mission of the Rotaract Club, various
          orientation programs were organized by The Rotaract Club of Arul Anandar
          College in association with the Rotary Club of Madurai North West.
        </p>

        <p className="text-sm md:text-lg text-gray-600 leading-relaxed py-2">
          We have also conducted awareness programs on social issues like women’s
          participation in politics, transgender rights, and more, creating a huge
          impact in the community.
        </p>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 border border-gray-300 rounded-md shadow-lg">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-full h-48 overflow-hidden rounded-lg shadow-xl transition-transform duration-300 transform hover:scale-105"
            >
              <a href={image} target="_blank" rel="noopener noreferrer">
                <img
                  loading="lazy"
                  src={image}
                  alt={`rotaract-sample-${index}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
