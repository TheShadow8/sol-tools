"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Howto from "./components/Howto";
import CreateToken from "./components/CreateToken";
import RevokeFreeze from "./components/RevokeFreeze";
import RevokeMint from "./components/RevokeMint";
import { ContextProvider } from "./contexts/ContextProvider";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <ContextProvider>
      <main className="min-h-screen h-auto dark bg-gradient-to-b to-[#110d36] from-[#0c0927] text-foreground">
        <Navbar />
        <div className="pb-10 sm:pb-20 mt-10 px-8 xl:px-5 max-w-screen-lg mx-auto grid gap-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="flex flex-col gap-16">
              <CreateToken />
              <RevokeFreeze />
              <RevokeMint />
            </div>
            <Howto />
          </div>
        </div>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </ContextProvider>
  );
}
