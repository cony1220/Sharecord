import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Loading from "../components/UI/Loading";

function MainLayout() {
  const { pathname } = useLocation();

  const footerVariant = pathname === "/" ? "introduce" : "default";
  return (
    <>
      <Header />

      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>

      <Footer variant={footerVariant} />
    </>
  );
}

export default MainLayout;
