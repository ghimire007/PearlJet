// API base URL - using relative path since frontend and backend are on same origin
const API_BASE_URL = 'http://3.27.193.154:3000/api';
// const TOKEN_KEY = 'flyDreamAirToken'; // Removed declaration, will use the one from index.html scope

// Helper to get token from localStorage
function getTokenFromStorage() { // Renamed slightly to avoid conflict if index.html script loads first
    // Assuming TOKEN_KEY is available globally or implicitly from index.html's scope
    return localStorage.getItem('flyDreamAirToken'); 
}

// Helper function to handle API responses
async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
}

/**
 * Makes a generic API call to the backend.
 * Handles setting headers, including Authorization token.
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/signup').
 * @param {string} method - HTTP method (e.g., 'POST', 'GET').
 * @param {object} [data] - The request body for POST/PUT requests.
 * @returns {Promise<object>} - The JSON response from the backend.
 * @throws {Error} - Throws an error if the network request fails or the backend returns a non-ok status.
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = getTokenFromStorage();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
        // credentials: 'include', // Removed to allow CORS with origin '*'
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse(response);
}

// --- Specific API Functions ---

/**
 * Calls the backend signup endpoint.
 * @param {object} userData - Data matching backend schema.
 * @returns {Promise<object>} - The success response from the backend (e.g., { message, userId, userName }).
 */
async function signupUser(userData) {
    return apiCall('/signup', 'POST', userData);
}

/**
 * Calls the backend login endpoint.
 * @param {object} credentials - { email, password }.
 * @returns {Promise<object>} - The success response containing the token and user details (e.g., { token, user }).
 */
async function loginUserApi(credentials) {
    return apiCall('/login', 'POST', credentials);
}

// User API calls
async function getUserProfile() {
    return apiCall('/user/profile');
}

async function updateUserProfile(userData) {
    return apiCall('/user/profile', 'PUT', userData);
}

// Booking API calls
async function getBookings() {
    return apiCall('/bookings');
}

async function createBooking(bookingData) {
    return apiCall('/bookings', 'POST', bookingData);
}

// Export all API functions
window.apiCall = apiCall;
window.loginUserApi = loginUserApi;
window.signupUser = signupUser;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;
window.getBookings = getBookings;
window.createBooking = createBooking;

// --- Header Auth Logic ---
function updateHeaderAuthButtons() {
    const loginBtn = document.getElementById('login-btn');
    const profileBtn = document.getElementById('profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if (!loginBtn || !profileBtn || !logoutBtn) return;

    // Remove previous listeners to avoid duplicates
    loginBtn.replaceWith(loginBtn.cloneNode(true));
    profileBtn.replaceWith(profileBtn.cloneNode(true));
    logoutBtn.replaceWith(logoutBtn.cloneNode(true));

    const newLoginBtn = document.getElementById('login-btn');
    const newProfileBtn = document.getElementById('profile-btn');
    const newLogoutBtn = document.getElementById('logout-btn');

    // Set up click handlers
    newLoginBtn.onclick = function() {
        window.location.href = '../onboarding/index.html';
    };
    newProfileBtn.onclick = function() {
        window.location.href = '../user_profile/index.html';
    };
    newLogoutBtn.onclick = function() {
        localStorage.clear();
        window.location.href = '../quickBook/index.html';
    };

    // Show/hide buttons based on auth state
    const token = localStorage.getItem('flyDreamAirToken');
    if (token) {
        newLoginBtn.style.display = 'none';
        newProfileBtn.style.display = 'block';
        newLogoutBtn.style.display = 'block';
    } else {
        newLoginBtn.style.display = 'block';
        newProfileBtn.style.display = 'none';
        newLogoutBtn.style.display = 'none';
    }
}

/**
 * Checks if user is authenticated and handles redirection if not
 * @param {boolean} [redirect=true] - Whether to redirect if not authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
function checkAuthAndRedirect(redirect = true) {
    const token = getTokenFromStorage();
    if (!token && redirect) {
        // Save current URL including query parameters before redirecting
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes('onboarding')) {
            localStorage.setItem('redirectAfterLogin', currentPath);
        }
        window.location.href = '../onboarding/index.html';
        return false;
    }
    return !!token;
}

// Export the new function
window.checkAuthAndRedirect = checkAuthAndRedirect;

document.addEventListener('DOMContentLoaded', function() {
    //observeHeaderForAuthButtons();
    // In case header is already loaded
    setTimeout(() => {
        updateHeaderAuthButtons();
        // Check if current page is public
        const currentPath = window.location.pathname;
        const isPublicPage = currentPath.includes('quickBook') || currentPath.includes('onboarding');
        
        // If not a public page, check authentication
        if (!isPublicPage) {
            checkAuthAndRedirect();
        }
    }, 500);
});

