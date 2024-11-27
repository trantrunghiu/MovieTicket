import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

// Định nghĩa kiểu cho UserContext
interface UserContextType {
  user: any;
  setUser: React.Dispatch<any>;
}

// Tạo Context cho người dùng
export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Lắng nghe sự thay đổi của trạng thái người dùng
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    // Dọn dẹp khi component unmount
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
