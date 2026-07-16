import React from "react";
import Home from "./pages/Home";
import useLenis from "./hooks/useLenis";

const App = () => {
  return (
    <div className="h-screen w-full">
      useLenis()
      <Home />
    </div>
  );
};

export default App;
