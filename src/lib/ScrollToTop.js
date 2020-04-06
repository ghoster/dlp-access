import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const search = window.location.search;
  console.log(pathname);
  console.log(search);

  useEffect(() => {
    const body = document.body;
    body.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
