import { useNavigate } from "react-router-dom";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
  };

  return { goTo };
};

export const navigateTo = (path: string) => {
  window.location.href = path;
};
