import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Products } from './pages/Products';
import { RawMaterials } from './pages/RawMaterials';
import { Production } from './pages/Production';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-semibold text-slate-900">Inventory Manager</h1>
                <div className="hidden md:flex space-x-1">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    Products
                  </NavLink>
                  <NavLink
                    to="/raw-materials"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    Raw Materials
                  </NavLink>
                  <NavLink
                    to="/production"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    Production
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/production" element={<Production />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
