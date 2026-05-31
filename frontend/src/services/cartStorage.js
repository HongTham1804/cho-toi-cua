export const CART_STORAGE_KEY = 'cho-toi-cua-cart';
export const CART_CHANGED_EVENT = 'cho-toi-cua-cart-changed';

export const readCartItems = () => {
  try {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch {
    return [];
  }
};

export const writeCartItems = (items) => {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
};

export const getCartTotalQuantity = (items = readCartItems()) =>
  items.reduce((total, item) => total + Number(item.quantity || 0), 0);

export const addCartItem = (product) => {
  const currentItems = readCartItems();
  const existingItem = currentItems.find((item) => item.id === product.id);

  const nextItems = existingItem
    ? currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: Number(item.quantity || 0) + 1 }
          : item
      )
    : [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          description: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          image: product.image,
          store_id: product.store_id,
          storeName: product.storeName,
        },
      ];

  writeCartItems(nextItems);
  return nextItems;
};
