// File: src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL;

// You need a way to get the auth token (e.g., from localStorage)
const token = localStorage.getItem('token'); 

export const createRoomAPI = async (roomData) => {
  const response = await fetch(`${API_BASE_URL}/room/create-room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(roomData),
  });
  if (!response.ok) throw new Error('Failed to create room');
  return response.json();
};

export const joinRoomAPI = async (roomId, joinData) => {
  const response = await fetch(`${API_BASE_URL}/room/${roomId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(joinData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to join room');
  }
  return response.json();
};