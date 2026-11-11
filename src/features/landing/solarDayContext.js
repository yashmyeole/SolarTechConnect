import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export const SolarDayContext = createContext(null);

export function useSolarDayActions() {
  return useContext(SolarDayContext);
}

export function useSolarFrame(selector) {
  return useStore(useContext(SolarDayContext).frame, useShallow(selector));
}
