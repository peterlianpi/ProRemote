import React from "react";
import HomePage from "./components/Home";
import { useConnection } from "./libs/connectionProvider";
import LoginPage from "./components/Login";

const Layout = () => {
  const { authenticated } = useConnection();

  return <>{!authenticated ? <LoginPage /> : <HomePage />}</>;
};

export default Layout;
