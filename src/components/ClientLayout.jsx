"use client";

import PropTypes from "prop-types";
import { useNavigationLoading } from "@/hooks/UseNavigationLoading";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Footer from "@/components/Footer";
import MessagingPopup from "@/components/MessagingPopup";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function ClientLayout({ children }) {
  const isLoading = useNavigationLoading();

  return (
    <Provider store={store}>
      <div className="flex flex-col min-h-screen">
        {isLoading && <LoadingSpinner />}
        <main className="flex-grow">{children}</main>
        <Footer />
        <MessagingPopup />
      </div>
    </Provider>
  );
}

ClientLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
