import React, { createContext, useState, useEffect } from 'react';
import { initialMockData } from '../utils/mockData';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [works, setWorks] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_works');
      if (saved) {
        const parsed = JSON.parse(saved);
        // 确保解析出来的是数组，否则使用初始数据
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse portfolio_works from localStorage:', e);
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
