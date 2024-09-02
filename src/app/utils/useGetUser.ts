import { useEffect, useState } from "react";

const useGetUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("user");

    setUserId(id);
    setUserName(name);
  }, []);

  return { userId, userName };
};

export default useGetUser;
