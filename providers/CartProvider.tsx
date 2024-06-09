import { CartItem, Product } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";

type CartType = {
    items: CartItem[];
    addItem: (product: Product, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
    total: number;
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => { },
    updateQuantity: () => { },
    total: 0
});

const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product, size: CartItem['size']) => {
        //if item already exists in cart, increase quantity
        const existingItem = items.find((item) => item.product_id === product.id && item.size === size);
        if (existingItem) {
            updateQuantity(existingItem.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        }

        setItems([newCartItem, ...items]);
    }

    //Update quantity
    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        const updatedItems = items
            .map((item) => item.id === itemId ? { ...item, quantity: item.quantity + amount } : item)
            .filter((item) => item.quantity > 0);
        setItems(updatedItems);
    };

    const total = items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total }}>
            {children}
        </CartContext.Provider>
    )
};

export default CartProvider;

export const useCart = () => useContext(CartContext);