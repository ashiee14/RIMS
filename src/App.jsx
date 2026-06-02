  import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
  import Layout from "./components/Layout";
  import HomePage from "./pages/HomePage";
  import IndexPage from "./pages/IndexPage";

  import SDGTaggerPage from "./pages/SDGTaggerPage";
  import JournalCheckerPage from "./pages/JournalCheckerPage";
  import ResearchAnalyticsPage from "./pages/ResearchAnalyticsPage";
  import MoreFeaturesPage from "./pages/MoreFeaturesPage";

  import PublicationsPage from "./pages/PublicationsPage";
  import PublicationDetailsPage from "./pages/PublicationDetailsPage";
  import AwardsPage from "./pages/AwardsPage";
  import AwardDetailsPage from "./pages/AwardDetailsPage";
  import IPRPage from "./pages/IPRPage";
  import IPRDetailsPage from "./pages/IPRDetailsPage";
  import BooksChaptersPage from "./pages/BooksChaptersPage";
  import BookDetailsPage from "./pages/BookDetailsPage";
  import ChapterDetailsPage from "./pages/ChapterDetailsPage";
  import EventsPage from "./pages/EventsPage";
  import EventDetailsPage from "./pages/EventDetailsPage";
  import ResearchPage from "./pages/ResearchPage";
  import EditResearchProjectPage from "./pages/EditResearchProjectPage";
  import ProjectDetailsPage from "./pages/ProjectDetailsPage";
  
  import AddAwardsPage from "./pages/AddAwardsPage";
  import AddIPRPage from "./pages/AddIPRPage";
  import AddEventPage from "./pages/AddEventPage";
  import AddBookPage from "./pages/AddBookPage";
  import AddChapterPage from "./pages/AddChapterPage";
  import AddPublicationsPage from "./pages/AddPublicationsPage";
  import AddResearchProjectPage from "./pages/AddResearchProjectPage";

  import UserProfilePage from "./pages/UserProfilePage";
  import UsersPage from "./pages/UsersPage";
  import AdminPanel from "./pages/AdminPanel";
  import AddUserPage from "./pages/AddUserPage";

  import { AuthProvider } from "./contexts/AuthContext";
  import ProtectedRoute from "./components/ProtectedRoute";

  function AppContent() {
    const location = useLocation();
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
          <Route path="/dashboard" element={<IndexPage />} key={location.key} />
          
          <Route path="/sdg-tagger" element={<SDGTaggerPage />} key={location.key} />
          <Route path="/journal-checker" element={<JournalCheckerPage />} key={location.key} />

          <Route path="/publications" element={<PublicationsPage />} key={location.key} />
          <Route path="/publications/:id" element={<PublicationDetailsPage />} key={location.key} />
          <Route path="/awards" element={<AwardsPage />} key={location.key} />
          <Route path="/awards/:id" element={<AwardDetailsPage />} key={location.key} />
          <Route path="/ipr" element={<IPRPage />} key={location.key} />
          <Route path="/ipr/:id" element={<IPRDetailsPage />} key={location.key} />
          <Route path="/books-chapters" element={<BooksChaptersPage />} key={location.key} />
          <Route path="/books/:id" element={<BookDetailsPage />} key={location.key} />
          <Route path="/chapters/:id" element={<ChapterDetailsPage />} key={location.key} />
          <Route path="/events" element={<EventsPage />} key={location.key} />
          <Route path="/events/:id" element={<EventDetailsPage />} key={location.key} />
          <Route path="/research" element={<ResearchPage />} key={location.key} />
          <Route path="/research/edit/:id" element={<EditResearchProjectPage />} key={location.key} />
          <Route path="/research/:id" element={<ProjectDetailsPage />} key={location.key} />

          <Route path="/add-awards" element={<AddAwardsPage />} key={location.key} />
          <Route path="/add-ipr" element={<AddIPRPage />} key={location.key} />
          <Route path="/add-event" element={<AddEventPage />} key={location.key} />
          <Route path="/add-book" element={<AddBookPage />} key={location.key} />
          <Route path="/books/:bookId/add-chapter" element={<AddChapterPage />} key={location.key} />
          <Route path="/add-publication" element={<AddPublicationsPage />} key={location.key} />
          <Route path="/add-research-project" element={<AddResearchProjectPage />} key={location.key} />

          <Route path="/user-profile" element={<UserProfilePage />} key={location.key} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/users" element={<UsersPage />} key={location.key} />
          <Route path="/admin" element={<AdminPanel />} key={location.key} />
          <Route path="/admin/add-user" element={<AddUserPage />} key={location.key} />  
        </Route>
      </Routes>
    );
  }

  function App() {
    return (
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    );
  }

  export default App;