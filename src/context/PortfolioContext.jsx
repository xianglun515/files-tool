import React, { createContext, useState, useEffect } from 'react';
import { initialMockData } from '../utils/mockData';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [works, setWorks] = useState(() => {
    const saved = localStorage.getItem('portfolio_works');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialMockData;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_works', JSON.stringify(works));
  }, [works]);

  const addWork = (work) => {
    const newWork = {
      ...work,
      id: Date.now().toString(),
      createdAt: Date.now(),
      tags: work.tags || [],
      jobs: work.jobs || [],
      optimized: false,
      addedToPortfolio: false
    };
    setWorks([newWork, ...works]);
  };

  const updateWork = (id, updatedData) => {
    setWorks(works.map(w => w.id === id ? { ...w, ...updatedData } : w));
  };

  const deleteWork = (id) => {
    setWorks(works.filter(w => w.id !== id));
  };

  const togglePortfolio = (id) => {
    setWorks(works.map(w => w.id === id ? { ...w, addedToPortfolio: !w.addedToPortfolio } : w));
  };

  return (
    <PortfolioContext.Provider value={{
      works,
      addWork,
      updateWork,
      deleteWork,
      togglePortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
