import axios from "axios";

const BASE_URL = "https://fakestoreapi.com/products";

export const apiService = {
  async getAllProducts() {
    try {
      // Make a GET request
      const response = await axios.get(BASE_URL, {
        headers: {
          "Content-Type": "application/json", // Optional for GET requests
        },
      });

      return response.data; // Return the data from the response
    } catch (error: any) {
      console.error("Error in fetching products:", error);

      if (error.response) {
        // The server responded with a status code outside 2xx
        throw error.response.data;
      } else if (error.request) {
        // No response received
        throw new Error("No response received from the server");
      } else {
        // Other errors
        throw new Error(error.message || "An unexpected error occurred");
      }
    }
  },

  async getCategories() {
    try {
      // Make a GET request
      const response = await axios.get(`${BASE_URL}/categories`, {
        headers: {
          "Content-Type": "application/json", // Optional for GET requests
        },
      });

      return response.data; // Return the data from the response
    } catch (error: any) {
      console.error("Error in fetching products:", error);

      if (error.response) {
        // The server responded with a status code outside 2xx
        throw error.response.data;
      } else if (error.request) {
        // No response received
        throw new Error("No response received from the server");
      } else {
        // Other errors
        throw new Error(error.message || "An unexpected error occurred");
      }
    }
  },
};
