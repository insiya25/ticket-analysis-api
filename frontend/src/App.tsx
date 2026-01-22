import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Overview } from './pages/Overview';
import { CategoryAnalysis } from './pages/CategoryAnalysis';
import { ClientDistribution } from './pages/ClientDistribution';
import { RawTickets } from './pages/RawTickets';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/category-analysis" element={<CategoryAnalysis />} />
              <Route path="/client-distribution" element={<ClientDistribution />} />
              <Route path="/raw-tickets" element={<RawTickets />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
