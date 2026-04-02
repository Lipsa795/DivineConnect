// import React, { createContext, useContext, useState, useEffect } from 'react';

// const DarkModeContext = createContext();

// export const useDarkMode = () => useContext(DarkModeContext);

// export const DarkModeProvider = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     // Check localStorage for saved preference
//     const savedMode = localStorage.getItem('darkMode');
//     return savedMode === 'true';
//   });

//   useEffect(() => {
//     // Save to localStorage
//     localStorage.setItem('darkMode', isDarkMode);
    
//     // Apply dark mode class to body
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//       document.body.classList.add('dark:bg-gray-900');
//     } else {
//       document.documentElement.classList.remove('dark');
//       document.body.classList.remove('dark:bg-gray-900');
//     }
//   }, [isDarkMode]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// };