// src/services/api.js
import axios from "axios";

const BASE_URL = "https://rims-api.prerna.sh/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ────────────────────────────────────────────────────────────────
   AUTO TOKEN REFRESH
──────────────────────────────────────────────────────────────── */

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/users/auth/token/refresh/")
      ) {
      originalRequest._retry = true;

      try {
        const newAccess = await refreshAccessToken();

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return API(originalRequest);

      } catch (refreshError) {

        // Logout if refresh fails
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


/* ────────────────────────────────────────────────────────────────
   GOOGLE AUTH
──────────────────────────────────────────────────────────────── */

// Exchange Google token for JWT tokens
export const googleLogin = async (googleToken, userInfo = null) => {
  const res = await API.post("/users/auth/google/", {
    token: googleToken,
  });

  // Store JWT tokens
  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);

  // Store Google user info
  if (userInfo) {
    localStorage.setItem(
      "user_info",
      JSON.stringify(userInfo)
    );
  }

  return res.data;
};


/* ────────────────────────────────────────────────────────────────
   LOGOUT
──────────────────────────────────────────────────────────────── */

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_info");

  window.location.href = "/login";
};

/* ────────────────────────────────────────────────────────────────
   REFRESH TOKEN
──────────────────────────────────────────────────────────────── */

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");

  if (!refresh) {
    throw new Error("No refresh token found");
  }

  const res = await axios.post(
    `${BASE_URL}/users/auth/token/refresh/`,
    {
      refresh,
    }
  );

  const newAccess = res.data.access;

  localStorage.setItem("access_token", newAccess);

  return newAccess;
};



// Utility function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ────────────────────────────────────────────────────────────────
   Overview Statistics
──────────────────────────────────────────────────────────────── */
export const getOverviewStats = async () => {
  await delay(300); // Simulate network delay
  return {
    totalPublications: 1732,
    retracted: 2,
    indexedPublications: 1506,
    impactFactor: {
      average: 1.76,
      cumulative: 3056.17,
    },
    researchImpact: {
      policy: 0,
      news: 561,
      wiki: 0,
      fwci: 0.71,
      pe: 855,
    },
    indexedIn: [
      { label: "Scopus", value: 1092, color: "#E8820C" },
      { label: "PubMed", value: 728, color: "#2563EB" },
      { label: "Web of Science", value: 989, color: "#C8941A" },
    ],
    hIndex: [
      { label: "Crossref", value: 87 },
      { label: "Scopus", value: 81 },
      { label: "WoS", value: 74 },
    ],
    i10Index: [
      { label: "Crossref", value: 1135 },
      { label: "Scopus", value: 880 },
      { label: "WoS", value: 707 },
    ],
    top1Percentile: 85,
    top10Percentile: 94,
    conferences: 456,
    fdps: 853,
    presentations: {
      paper: 66,
      poster: 51,
    },
    iprs: 62,
    awards: 28,
    researchProjects: 108,
    researchGrants: 21.3684,
    booksChapters: 64,
    events: 433,
  };
};

/* ────────────────────────────────────────────────────────────────
   Quartile Distribution
──────────────────────────────────────────────────────────────── */ 
export const getQuartileData = async () => {
  await delay(300);
  return [
    { label: "Q1", value: 204, color: "#B22222" },
    { label: "Q2", value: 227, color: "#1D6B5E" },
    { label: "Q3", value: 198, color: "#C8941A" },
    { label: "Q4", value: 222, color: "#4A90D9" },
    { label: "None", value: 989, color: "#888888" },
  ];
};

/* ────────────────────────────────────────────────────────────────
   Sustainable Development Goals (SDG)
──────────────────────────────────────────────────────────────── */
export const getSDGData = async () => {
  await delay(300);
  return [
    { label: "SDG 3", count: 1362, color: "#E5243B", icon: "🌍" },
    { label: "SDG 7", count: 167, color: "#FCC30B", icon: "⚡" },
    { label: "SDG 4", count: 102, color: "#C5192D", icon: "📘" },
    { label: "SDG 15", count: 71, color: "#3F7E44", icon: "🌳" },
    { label: "SDG 5", count: 70, color: "#FF3A21", icon: "👩" },
    { label: "SDG 17", count: 54, color: "#A21942", icon: "🤝" },
  ];
};

/* ────────────────────────────────────────────────────────────────
   Publication Trend
──────────────────────────────────────────────────────────────── */
export const getPublicationTrend = async () => {
  await delay(300);
  return [
    { year: 2020, indexed: 150, crossref: 90, scopus: 70 },
    { year: 2021, indexed: 220, crossref: 130, scopus: 110 },
    { year: 2022, indexed: 320, crossref: 200, scopus: 170 },
    { year: 2023, indexed: 400, crossref: 260, scopus: 210 },
    { year: 2024, indexed: 506, crossref: 320, scopus: 260 },
  ];
};

/* ────────────────────────────────────────────────────────────────
   Citation Totals
──────────────────────────────────────────────────────────────── */
export const getCitationTotals = async () => {
  await delay(300);
  return {
    crossref: 87657,
    scopus: 63699,
  };
};

/* ────────────────────────────────────────────────────────────────
   Institutional Data
──────────────────────────────────────────────────────────────── */
export const getColleges = async () => {
  await delay(300);
  return [
    {
      id: 1,
      name: "Dr. D.Y. Patil Medical College",
      totalPublications: 1225,
      indexedBreakdown: {
        total: 1064,
        scopus: 700,
        wos: 778,
        pubmed: 688,
      },
      totalCitations: 63940,
      avgImpactFactor: 1.87,
      quartiles: {
        q1: 311,
        q2: 220,
        q3: 171,
        q4: 145,
        none: 371,
      },
    },
    {
      id: 2,
      name: "Dr. D.Y. Patil Dental College",
      totalPublications: 177,
      indexedBreakdown: {
        total: 157,
        scopus: 145,
        wos: 93,
        pubmed: 84,
      },
      totalCitations: 16880,
      avgImpactFactor: 3.52,
      quartiles: {
        q1: 46,
        q2: 52,
        q3: 32,
        q4: 23,
        none: 24,
      },
    },
    {
      id: 3,
      name: "Dr. D.Y. Patil Vidyapeeth",
      totalPublications: 10,
      indexedBreakdown: {
        total: 10,
        scopus: 6,
        wos: 8,
        pubmed: 6,
      },
      totalCitations: 4380,
      avgImpactFactor: 10.3,
      quartiles: {
        q1: 4,
        q2: 0,
        q3: 1,
        q4: 1,
        none: 5,
      },
    },
    {
      id: 4,
      name: "Dr. D.Y. Patil School of Allied Health Sciences",
      totalPublications: 26,
      indexedBreakdown: {
        total: 25,
        scopus: 23,
        wos: 4,
        pubmed: 0,
      },
      totalCitations: 330,
      avgImpactFactor: 0.05,
      quartiles: {
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 3,
        none: 23,
      },
    },
    {
      id: 5,
      name: "Techno India University",
      totalPublications: 320,
      indexedBreakdown: {
        total: 210,
        scopus: 120,
        wos: 60,
        pubmed: 30,
      },
      totalCitations: 5400,
      avgImpactFactor: 3.8,
      quartiles: {
        q1: 50,
        q2: 70,
        q3: 40,
        q4: 30,
        none: 20,
      },
    },
  ];
};

/* ────────────────────────────────────────────────────────────────
   Create user API
──────────────────────────────────────────────────────────────── */
export const createUser = async (data) => {
  const res = await API.post("/users/", data);
  return res.data;
};

/* ────────────────────────────────────────────────────────────────
   Research Projects API
──────────────────────────────────────────────────────────────── */

// GET all projects
export const fetchProjects = async (params = {}) => {
  const res = await API.get("/projects/", {
    params,
  });
  return res.data;
};

// CREATE project
export const createProject = async (data) => {
  const res = await API.post("/projects/create/", data);
  return res.data;
};

// UPDATE project
export const updateProject = async (id, data) => {
  const res = await API.patch(`/projects/${id}/`, data);
  return res.data;
};

// DELETE project
export const deleteProject = async (id) => {
  const res = await API.delete(`/projects/${id}/`);
  return res.data;
};

// FETCH project details by ID
export const fetchProjectById = async (id) => {
  try {
    const response = await API.get(`/projects/${id}/`);
    return response.data;
  } catch (error) {
    console.error("FETCH PROJECT DETAILS ERROR:", error);
    throw error;
  }
};


/* ────────────────────────────────────────────────────────────────
   Publications API
──────────────────────────────────────────────────────────────── */

// GET all publications
export const fetchPublications = async (params = {}) => {
  const res = await API.get("/publications/", {
    params,
  });

  return res.data;
};

// GET publication by ID
export const fetchPublicationById = async (id) => {
  const res = await API.get(`/publications/${id}/`);
  return res.data;
};

// GET logged-in user's publications
export const fetchMyPublications = async () => {
  const res = await API.get("/publications/mine/");
  return res.data;
};

// SEARCH publications
export const searchPublications = async (query, type = "all") => {
  const res = await API.get("/publications/search/", {
    params: {
      q: query,
      type,
    },
  });

  return res.data;
};

// GET publication stats
export const fetchPublicationStats = async () => {
  const res = await API.get("/publications/stats/");
  return res.data;
};

// SYNC publications
export const syncPublications = async () => {
  const res = await API.post("/publications/sync/");
  return res.data;
};

// CREATE publication
export const createPublication = async (data) => {
  const res = await API.post(
    "/publications/",
    data
  );

  return res.data;
};

// UPDATE publication
export const updatePublication = async (
  id,
  data
) => {
  const res = await API.patch(
    `/publications/${id}/`,
    data
  );

  return res.data;
};

// DELETE publication
export const deletePublication = async (
  id
) => {
  const res = await API.delete(
    `/publications/${id}/`
  );

  return res.data;
};

// UPLOAD publication certificate/pdf
export const uploadPublicationCertificate =
  async (formData) => {
    const res = await API.post(
      "/publications/upload-certificate/",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data;
  };


/* ────────────────────────────────────────────────────────────────
   IPR API
──────────────────────────────────────────────────────────────── */

export const fetchIPRs = async (params = {}) => {
  const res = await API.get("/ipr/", {
    params: {
      ordering: "-id",
      ...params,
    },
  });

  return res.data;
};

// GET IPR by ID
export const fetchIPRById = async (id) => {
  const res = await API.get(`/ipr/${id}/`);
  return res.data;
};

// CREATE IPR
export const addIPR = async (data) => {
  const res = await API.post("/ipr/create/", data);
  return res.data;
};

// UPDATE IPR
export const updateIPR = async (id, data) => {
  const res = await API.patch(`/ipr/${id}/`, data);
  return res.data;
};

// DELETE IPR
export const deleteIPR = async (id) => {
  const res = await API.delete(`/ipr/${id}/`);
  return res.data;
};  


/* ────────────────────────────────────────────────────────────────
   Events Extra API
──────────────────────────────────────────────────────────────── */

// GET single event
export const fetchEventById = async (id) => {
  const res = await API.get(`/events/${id}/`);
  return res.data;
};

// PARTICIPATE in event
export const participateInEvent = async (id) => {
  const res = await API.post(`/events/${id}/participate/`);
  return res.data;
};

// LEAVE event
export const leaveEvent = async (id) => {
  const res = await API.delete(`/events/${id}/participate/`);
  return res.data;
};

/* ────────────────────────────────────────────────────────────────
   Books API
──────────────────────────────────────────────────────────────── */

// GET all books
export const fetchBooks = async (params = {}) => {
  const res = await API.get("/books/", {
    params,
  });

  return res.data;
};

// GET single book
export const fetchBookById = async (id) => {
  const res = await API.get(`/books/${id}/`);

  return res.data;
};

// CREATE book
export const addBook = async (data) => {
  const res = await API.post("/books/create/", data);

  return res.data;
};

// UPDATE book
export const updateBook = async (id, data) => {
  const res = await API.patch(`/books/${id}/`, data);

  return res.data;
};

// DELETE book
export const deleteBook = async (id) => {
  const res = await API.delete(`/books/${id}/`);

  return res.data;
};

// CREATE chapter
export const createChapter = async (bookId, payload) => {
  const normalizedPayload = {
    title: payload.title,
    chapter_number: Number(payload.chapter_number),
    content: payload.content || "",
  };

  const res = await API.post(
    `/books/${bookId}/chapters/create/`,
    normalizedPayload
  );

  return res.data;
};
 
// GET single chapter
export const fetchChapterById = async (id) => {
  const res = await API.get(`/chapters/${id}/`);

  return res.data?.data || res.data?.chapter || res.data;
};

/* ────────────────────────────────────────────────────────────────
   Dashboard API
──────────────────────────────────────────────────────────────── */

// GET logged-in user dashboard
export const fetchMyDashboard = async () => {
  const res = await API.get("/dashboard/me/");
  return res.data;
};

// GET college dashboard
export const fetchCollegeDashboard = async () => {
  const res = await API.get("/dashboard/college/");
  return res.data;
};

// GET dashboard by user ID
export const fetchUserDashboard = async (id) => {
  const res = await API.get(`/dashboard/user/${id}/`);
  return res.data;
};

/* ────────────────────────────────────────────────────────────────
   Journal Check API
──────────────────────────────────────────────────────────────── */

export const checkJournal = async (issn) => {
  const res = await API.get(
    "/publications/journal/check/",
    {
      params: { issn },
    }
  );

  return res.data;
};

/* ────────────────────────────────────────────────────────────────
   ORCID API
──────────────────────────────────────────────────────────────── */

// Preview ORCID profile
export const previewORCID = async (orcidId) => {
  const response = await API.get(
    `/users/orcid/preview/?orcid_id=${orcidId}`
  );
  return response.data;
};

// Link ORCID account
export const linkORCID = async (data) => {
  const res = await API.post(
    "/users/orcid/link/",
    data
  );

  return res.data;
};

/* ────────────────────────────────────────────────────────────────
   Extract APIs
──────────────────────────────────────────────────────────────── */

// Extract Book Metadata
export const extractBook = async (formData) => {
  const res = await API.post(
    "/books/extract/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Extract IPR Metadata
export const extractIPR = async (formData) => {
  const res = await API.post(
    "/ipr/extract/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Extract Project Metadata
export const extractProject = async (
  formData
) => {
  const res = await API.post(
    "/projects/extract/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};


export default API;