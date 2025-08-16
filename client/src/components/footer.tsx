import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Main footer content */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Assam Down Town University Confessions. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Coded & brewed</span>
              <span className="text-lg animate-pulse">☕</span>
              <span>by</span>
              <a
                href="https://www.instagram.com/debashishbordoloi007/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-adtu-blue dark:hover:text-blue-400 transition-all duration-200 group font-medium hover:scale-105"
              >
                <span>Debashish</span>
                <Instagram className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
              </a>
            </div>
          </div>


        </div>
      </div>
    </footer>
  );
} 