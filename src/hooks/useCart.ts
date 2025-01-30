import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";
import type { CartItem, Product } from '../types'

export const useCart = () => {

    const initialCart = () : CartItem[] => {
            try {
                const localDataCart = localStorage.getItem('cart');
                const parsedCart = localDataCart ? JSON.parse(localDataCart) : [];
                return Array.isArray(parsedCart) ? parsedCart : [];
            } catch (error) {
                console.error("Error reading cart from localStorage:", error);
                return [];
            }
        };
    
        const [products] = useState(db);
        const [cart, setCart] = useState(initialCart);
    
        const MAX_QUANTITY = 10;
        const MIN_QUANTITY = 1;
    
        useEffect(() => {
            localStorage.setItem('cart', JSON.stringify(cart));
        }, [cart]);
    
        function addToCart(product : Product) {
            const productExists = cart.findIndex(p => p.id === product.id);
            if (productExists >= 0) {
                const newCart = [...cart];
                newCart[productExists].quantity++;
                setCart(newCart);
            } else {
                const newProduct : CartItem = {...product, quantity: 1}
                setCart([...cart, newProduct]);
            }
        }
    
        function removeFromCart(idProduct : Product['id']) {
            setCart(prevCart => prevCart.filter(product => product.id !== idProduct));
        }
    
        function increaseQuantity(idProduct : Product['id']) {
            const updatedCart = cart.map(product => {
                if (product.id === idProduct && product.quantity < MAX_QUANTITY) {
                    return {
                        ...product,
                        quantity: product.quantity + 1
                    }
                }
                return product;
            });
            setCart(updatedCart);
        }
    
        function decreaseQuantity(idProduct : Product['id']) {
            const updatedCart = cart.map(product => {
                if (product.id === idProduct && product.quantity > MIN_QUANTITY) {
                    return {
                        ...product,
                        quantity: product.quantity - 1
                    }
                }
                return product;
            });
            setCart(updatedCart);
        }
    
        function clearCart() {
            setCart([]);
        }

        //State Derivado
        const isEmpty = useMemo(() => cart.length === 0, [cart]); 
        const total = useMemo(() => cart.reduce((acc, product) => acc + product.price * product.quantity, 0), [cart]);

    return{
        products,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        total,
        isEmpty
    }
}