// stores/useStore.ts
import { create } from 'zustand';

interface Product {
  id: number;
  article: string;
  quantite: number;
  prixUsine: number;
  montantUsine: number;
  prixCotonou: number;
  prixVenteCotonou: number;
}

interface Depenses {
  douane: number;
  transport: number;
  imprevu: number;
}

interface Store {
  products: Product[];
  depenses: Depenses;
  isDeleting: boolean;
  
  // Actions pour les produits
  addProduct: () => void;
  removeProduct: (id: number) => void;
  updateProduct: (id: number, field: keyof Product, value: string | number) => void;
  
  // Actions pour les dépenses
  updateDepense: (field: keyof Depenses, value: number) => void;
  
  // Calculs dérivés (getters)
  getTotalMontantUsine: () => number;
  getTotalDepenses: () => number;
  getTotalPrixRevient: () => number;
  getTotalPrixVenteCotonou: () => number;
  getBenefices: () => number;
  getProductsWithCalculations: () => Product[];
}

export const useStore = create<Store>((set, get) => ({
  // État initial
  products: [{ id: 1, article: '', quantite: 0, prixUsine: 0, montantUsine: 0, prixCotonou: 0, prixVenteCotonou: 0 }],
  depenses: { douane: 0, transport: 0, imprevu: 0 },
  isDeleting: false,

  // Actions
  addProduct: () => set((state) => ({
    products: [...state.products, {
      id: Date.now(),
      article: '',
      quantite: 0,
      prixUsine: 0,
      montantUsine: 0,
      prixCotonou: 0,
      prixVenteCotonou: 0
    }]
  })),

  removeProduct: (id: number) => set((state) => {
    if (state.products.length <= 1) return state;
    return {
      isDeleting: true,
      products: state.products.filter(product => product.id !== id)
    };
  }),

  updateProduct: (id: number, field: keyof Product, value: string | number) => 
    set((state) => ({
      products: state.products.map(product =>
        product.id === id ? { ...product, [field]: value } : product
      )
    })),

  updateDepense: (field: keyof Depenses, value: number) => 
    set((state) => ({
      depenses: { ...state.depenses, [field]: value }
    })),

  // Getters (fonctions qui retournent les valeurs calculées)
  getTotalMontantUsine: () => {
    const state = get();
    return state.products.reduce((sum, product) => 
      sum + (product.quantite * product.prixUsine), 0);
  },

  getTotalDepenses: () => {
    const state = get();
    return Object.values(state.depenses).reduce((sum, value) => sum + value, 0);
  },

  getTotalPrixRevient: () => {
    return get().getTotalMontantUsine() + get().getTotalDepenses();
  },

  getTotalPrixVenteCotonou: () => {
    const state = get();
    return state.products.reduce((sum, product) => 
      sum + (product.quantite * product.prixCotonou), 0);
  },

// // Calcul des totaux
//   const totalMontantUsine = products.reduce((sum, product) => sum + (product.quantite * product.prixUsine), 0);
//   const totalDepenses = Object.values(depenses).reduce((sum, value) => sum + value, 0);
//   const totalPrixRevient = totalMontantUsine + totalDepenses;
//   const totalPrixVenteCotonou = products.reduce((sum, product) => sum + (product.quantite * product.prixCotonou), 0);
//   // const benefices = totalPrixVenteCotonou - totalPrixRevient

  getBenefices: () => {
    return get().getTotalPrixVenteCotonou() - get().getTotalPrixRevient();
  },

  getProductsWithCalculations: () => {
    const state = get();
    return state.products.map(product => {
      const montantUsine = product.quantite * product.prixUsine;
      const prixVenteCotonou = product.quantite * product.prixCotonou;
      
      return {
        ...product,
        montantUsine,
        prixVenteCotonou
      };
    });
  }
}));