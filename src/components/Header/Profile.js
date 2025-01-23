import React from "react";

function Profile() {
  return (
    <a
      href="/profile"
      className="text-gray-700 hover:text-blue-600 flex items-center"
    >
      <span className="material-symbols-outlined text-3xl">
        account_circle
      </span>
    </a>
  );
}

export default Profile;
