import React from "react";

// --- SVG Icons for Roles ---
const StreamerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-emerald-600"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2-1z" />
  </svg>
);

const ViewerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-indigo-600"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Reusable Role Badge with Icon ---
const RoleBadge = ({ role }) => {
  const isStreamer = role === "streamer";
  const baseClasses =
    "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium";
  const streamerClasses = "bg-emerald-100 text-emerald-900";
  const viewerClasses = "bg-indigo-100 text-indigo-900";

  return (
    <div className={`${baseClasses} ${isStreamer ? streamerClasses : viewerClasses}`}>
      {isStreamer ? <StreamerIcon /> : <ViewerIcon />}
      <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
    </div>
  );
};

// --- Reusable Avatar ---
const Avatar = ({ name }) => (
  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200">
    <span className="font-semibold text-slate-600">
      {name.charAt(0).toUpperCase()}
    </span>
  </div>
);

// --- Single Participant Item ---
const ParticipantItem = ({ participant }) => (
  <li className="flex flex-col items-start gap-y-2 rounded-lg p-3 transition-colors duration-200 ease-in-out hover:bg-slate-100 sm:flex-row sm:items-center sm:justify-between">
    {/* Left side: Avatar + Name/Email */}
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={participant.name} />
      <div className="min-w-0">
        <p
          className="truncate font-semibold text-slate-800"
          title={participant.name}
        >
          {participant.name}
        </p>
        <p
          className="truncate text-sm text-slate-500"
          title={participant.email}
        >
          {participant.email}
        </p>
      </div>
    </div>

    {/* Right side: Role */}
    <div className="pl-12 sm:pl-0">
      <RoleBadge role={participant.role} />
    </div>
  </li>
);

// --- Main ParticipantList Component ---
const ParticipantList = ({ participants }) => {
  return (
    <div className="h-full w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Participants{" "}
        <span className="ml-1 rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-slate-700">
          {participants.length}
        </span>
      </h2>

      {participants.length > 0 ? (
        <ul className="mt-4 space-y-1">
          {participants.map((p) => (
            <ParticipantItem key={p.id} participant={p} />
          ))}
        </ul>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <p className="font-medium text-slate-600">Waiting for others...</p>
          <p className="text-sm text-slate-400">You're the first one here!</p>
        </div>
      )}
    </div>
  );
};

export default ParticipantList;