import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

// define interface first
export interface NavigationContextType {
  drawerMenu: boolean;
  setDrawerMenu: Dispatch<SetStateAction<boolean>>;
}

// then create context using interfae and define exporting states
export const NavigationContext = createContext<NavigationContextType>({
  drawerMenu: false,
  setDrawerMenu: () => {},
});


// then export context by wrapping it in useContext hook
export const useNavigationContext = () => useContext(NavigationContext);
