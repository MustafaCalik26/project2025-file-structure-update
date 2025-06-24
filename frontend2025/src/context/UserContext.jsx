import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // localStorage'dan user'ı direkt başlatıyoruz
  const savedUser = localStorage.getItem('user');
  const [user, setUserState] = useState(savedUser ? JSON.parse(savedUser) : null);

  // user'ı hem state'e hem localStorage'a yazan fonksiyon
  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
