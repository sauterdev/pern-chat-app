import { useNavigate } from 'react-router-dom';

const { createContext, useState, useEffect } = require('react');

//export the context that is created, not the component
export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:4000/auth/login', {
      credentials: 'include',
    })
      .catch((err) => {
        setUser({ loggedIn: false });
        return;
      })
      .then((res) => {
        if (!res || !res.ok || res.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) {
          setUser({ loggedIn: false });
          return;
        }
        setUser({ ...data });
        navigate('/home');
      });
  }, []);

  return <AccountContext.Provider value={{ user, setUser }}>{children}</AccountContext.Provider>;
};

// lets us set our user from anywhere in the application

export default UserContext;
