import { jwtDecode } from 'jwt-decode';

// Utility function to check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Compare expiration time with current time
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true; // If token is invalid or expired
  }
};

export { isTokenExpired };
