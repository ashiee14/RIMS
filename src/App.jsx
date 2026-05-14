  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  import Layout from "./components/Layout";
  import HomePage from "./pages/HomePage";
  import IndexPage from "./pages/IndexPage";

  import SDGTaggerPage from "./pages/SDGTaggerPage";
  import JournalCheckerPage from "./pages/JournalCheckerPage";
  import ResearchAnalyticsPage from "./pages/ResearchAnalyticsPage";
  import MoreFeaturesPage from "./pages/MoreFeaturesPage";

  import PublicationsPage from "./pages/PublicationsPage";
  import AwardsPage from "./pages/AwardsPage";
  import IPRPage from "./pages/IPRPage";
  import PapersPage from "./pages/PapersPage";
  import PostersPage from "./pages/PostersPage";
  import BooksChaptersPage from "./pages/BooksChaptersPage";
  import EventsPage from "./pages/EventsPage";
  import ResearchPage from "./pages/ResearchPage";
  
  import AddAwardsPage from "./pages/AddAwardsPage";
  import AddPublicationsPage from "./pages/AddPublicationsPage";
  import AddResearchProjectPage from "./pages/AddResearchProjectPage";

  import UserProfilePage from "./pages/UserProfilePage";
  import AdminPanel from "./pages/AdminPanel";
  import AddUserPage from "./pages/AddUserPage";

  import { AuthProvider } from "./contexts/AuthContext";
  import ProtectedRoute from "./components/ProtectedRoute";

  function App() {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              
              <Route path="/dashboard" element={<IndexPage />} />
              
              <Route path="/sdg-tagger" element={<SDGTaggerPage />} />
              <Route path="/journal-checker" element={<JournalCheckerPage />} />
              <Route path="/research-analytics" element={<ResearchAnalyticsPage />} />
              <Route path="/more-features" element={<MoreFeaturesPage />} />

              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/awards" element={<AwardsPage />} />
              <Route path="/ipr" element={<IPRPage />} />
              <Route path="/papers" element={<PapersPage />} />
              <Route path="/posters" element={<PostersPage />} />
              <Route path="/books-chapters" element={<BooksChaptersPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/research" element={<ResearchPage />} />

              <Route path="/add-awards" element={<AddAwardsPage />} />
              <Route path="/add-publication" element={<AddPublicationsPage />} />
              <Route path="/add-research-project" element={<AddResearchProjectPage />} />
              
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/add-user" element={<AddUserPage />} />  
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    );
  }

  export default App;