import React from "react";
import Home from "./pages/Home";
import useLenis from "./hooks/useLenis";

const App = () => {
  useLenis();
  return (
    <div className="h-screen w-full">
      <Home />
    </div>
  );
};

export default App;
