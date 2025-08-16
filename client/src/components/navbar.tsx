import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "Feed", href: "/" },
    { name: "Submit", href: "/submit" },
    { name: "Admin", href: "/admin" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const NavLinks = ({ mobile = false }) => (
    <div className={`${mobile ? "flex flex-col space-y-4" : "hidden md:flex items-center space-x-6"}`}>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`${
            isActive(item.href)
              ? "text-adtu-blue dark:text-blue-400 font-medium border-b-2 border-adtu-blue dark:border-blue-400 pb-1"
              : "text-gray-600 dark:text-gray-300 hover:text-adtu-blue dark:hover:text-blue-400 transition-colors"
          } ${mobile ? "text-lg" : ""}`}
          data-testid={`link-${item.name.toLowerCase()}`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center" data-testid="link-logo">
            <div className="w-10 h-10 bg-adtu-blue rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-adtu-blue dark:text-blue-400">ADTU Confessions</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Anonymous University Confessions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavLinks />

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-8 mt-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-adtu-blue rounded-lg flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-adtu-blue dark:text-blue-400">ADTU Confessions</h2>
                    </div>
                  </div>
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
