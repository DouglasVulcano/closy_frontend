import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detecta se o valor de busca é um email ou nome
 * @param searchValue - Valor digitado pelo usuário
 * @returns { isEmail: boolean, value: string }
 */
export function detectSearchType(searchValue: string): { isEmail: boolean; value: string } {
  const trimmedValue = searchValue.trim();

  return {
    isEmail: trimmedValue.includes('@'),
    value: trimmedValue
  };
}
