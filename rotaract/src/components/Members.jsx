import React from "react";

export default function FacultyMembers() {
  const members = [
    {
      name: "Dr. Martin S",
      designation: "Coordinator",
      department: "Chemistry",
      description: "Guiding students to make meaningful contributions to society.",
      image: "/co_ordinator.png",
    },
    {
      name: "Ms. Glory Gurusheth A J",
      designation: "Member",
      department: "Business Administration",
      description: "Empowering youth through education and leadership.",
      image: "/member1.png",
    },
    {
      name: "Dr. Muthu Perumal P V",
      designation: "Member",
      department: "English Literature",
      description: "Inspiring creativity and critical thinking.",
      image: "/member2.png",
    },
    {
      name: "Ms. Rani V",
      designation: "Member",
      department: "No Data",
      description: "Dedicated to fostering responsibility in students.",
      image: "/img_placeholder.png",
    },
  ];

  return (
    <div className="py-12 px-8 ">
      <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Meet Our Faculty Members
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Our faculty members are the backbone of the Rotaract Club, dedicated to mentoring and guiding students to become responsible citizens and leaders.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300   transition-all hover:-translate-y-1 shadow-lg rounded-lg p-6 flex flex-col items-center text-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover border border-gray-300 mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">{member.name}</h2>
            <p className="text-sm text-gray-600">{member.designation}</p>
            <p className="text-sm text-gray-600 italic mb-2">
              {member.department}
            </p>
            {/* <p className="text-sm text-gray-500">{member.description}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
