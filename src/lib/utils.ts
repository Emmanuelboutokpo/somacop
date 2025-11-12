import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 export type MenuOption = 'facture' | 'dechargement';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const parts = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
  }).split(" ");

  // parts = ["lundi", "22", "novembre", "2021"]
  return `${parts[0]} ${parts[2]} ${parts[3]}`; // -> "lundi novembre 2021"
};

