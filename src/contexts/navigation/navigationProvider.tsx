import React, { useState } from "react";
import {NavigationContext} from "./navigationContext";

export const NavigationProvider = ({ children }:{children:React.ReactNode}) => {

  const [drawerMenu, setDrawerMenu] = useState(false);

  const defaultProps = {
    drawerMenu,
    setDrawerMenu,
  }

  return (
    <NavigationContext.Provider value={defaultProps}>
      {children}
    </NavigationContext.Provider>
  );
};
