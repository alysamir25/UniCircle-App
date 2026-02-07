import axios from 'axios';

// Base URL for your future backend API
const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your actual backend URL
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data service for development (remove when real API is ready)
export const mockApi = {
  // Posts
  getPosts: async () => {
    return [
      {
        id: 1,
        title: "Welcome to the New Semester!",
        author: "Alex Chen",
        time: "2 hours ago",
        content: "Our first meet-up is scheduled for next Friday...",
        comments: 3,
        likes: 24,
        badge: "Committee"
      },
      // Add more mock posts as needed
    ];
  },

  // Events
  getEvents: async () => {
    return [
      {
        id: 1,
        title: "Weekend Hackathon",
        date: "2024-03-15",
        location: "Innovation Lab",
        description: "48-hour coding marathon with prizes!",
        capacity: 50,
        registered: 32
      },
    ];
  },

  // Authentication mock (replace with real OAuth2.0)
  login: async (credentials: { email: string; password: string }) => {
    // In real app, this would call your Solent University OAuth2.0 endpoint
    return { token: 'mock-jwt-token', user: { id: 1, name: 'Demo User', role: 'member' } };
  }
};

export default api;