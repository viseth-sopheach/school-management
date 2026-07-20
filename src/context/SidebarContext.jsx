import { createContext, useEffect, useState } from "react";

export const SidebarContext = createContext(null);

const STORAGE_KEY = "sidebar-collapsed";

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false); // mobile overlay
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isCollapsed);
  }, [isCollapsed]);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleCollapsed = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isCollapsed,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        toggleCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
