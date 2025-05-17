const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if your API prefix is different
// const TOKEN_KEY = 'flyDreamAirToken'; // Removed declaration, will use the one from index.html scope

// Helper to get token from localStorage
function getTokenFromStorage() { // Renamed slightly to avoid conflict if index.html script loads first
    // Assuming TOKEN_KEY is available globally or implicitly from index.html's scope
    return localStorage.getItem('flyDreamAirToken'); 
}

/**
 * Makes a generic API call to the backend.
 * Handles setting headers, including Authorization token.
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/signup').
 * @param {string} method - HTTP method (e.g., 'POST', 'GET').
 * @param {object} [body] - The request body for POST/PUT requests.
 * @returns {Promise<object>} - The JSON response from the backend.
 * @throws {Error} - Throws an error if the network request fails or the backend returns a non-ok status.
 */
async function apiCall(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    const token = getTokenFromStorage(); // Use the renamed helper
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        // Attempt to parse JSON regardless of status for potential error messages
        let responseData;
        try {
            responseData = await response.json();
        } catch (jsonError) {
            // If JSON parsing fails, use status text as fallback message
            if (!response.ok) {
                 throw new Error(response.statusText || `HTTP error! status: ${response.status}`);
            }
             // If response was ok but no JSON body (e.g., 204 No Content), return null or handle as needed
            return null; 
        }
        
        if (!response.ok) {
             // Use error message from backend response if available, otherwise use status text
            const errorMessage = responseData.message || response.statusText || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return responseData;

    } catch (error) {
        console.error('API Call Error:', error);
        // Re-throw the error so the calling function can handle it
        throw error; 
    }
}

// --- Specific API Functions ---

/**
 * Calls the backend signup endpoint.
 * @param {object} registrationData - Data matching backend schema.
 * @returns {Promise<object>} - The success response from the backend (e.g., { message, userId, userName }).
 */
async function signupUser(registrationData) {
    return apiCall('/signup', 'POST', registrationData);
}

/**
 * Calls the backend login endpoint.
 * @param {object} credentials - { email, password }.
 * @returns {Promise<object>} - The success response containing the token (e.g., { token }).
 */
async function loginUserApi(credentials) { // Renamed to avoid conflict with previous inline function name
    return apiCall('/login', 'POST', credentials);
}

// Example for future use: Get user details (requires token)
// async function fetchUserDetails() {
//     return apiCall('/user', 'GET');
// }

// Example for future use: Update user details (requires token)
// async function updateUserDetails(updateData) {
//     return apiCall('/user', 'PUT', updateData);
// } 