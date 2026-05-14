// Centralized API configuration
// This URL will be used for all API calls across the frontend.
// The root vercel.json is configured to proxy /api and /uploads to the Render backend.
//  cherck
// asdasdasd
// Force redeploy with new backend URL: https://devisions.onrender.com
export const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://devisions.onrender.com";

// Helper to resolve image URLs (handles both local uploads and cloud storage)
export const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
};

