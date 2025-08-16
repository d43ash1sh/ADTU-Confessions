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

          {/* ADTU fam shoutout */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                Shoutout to the ADTU fam:
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
                <a
                  href="https://www.instagram.com/adtu_confessout_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-adtu-blue dark:hover:text-blue-400 transition-all duration-200 group font-medium px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Instagram className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                  <span>@adtu_confessout_</span>
                </a>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <a
                  href="https://www.instagram.com/adtu_wallah_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-adtu-blue dark:hover:text-blue-400 transition-all duration-200 group font-medium px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Instagram className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                  <span>@adtu_wallah_</span>
                </a>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <a
                  href="https://www.instagram.com/adtuconfessout_2.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-adtu-blue dark:hover:text-blue-400 transition-all duration-200 group font-medium px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Instagram className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                  <span>@adtuconfessout_2.0</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 