import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosAPI";

const CartItemsPopup = ({ cartId, handleCloseCart }) => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const timestamp = Date.now();
            const response = await axiosInstance.get(`cart/retrieve/?timestamp=${timestamp}`);
            if (response.status === 200) {
                const data = await response.data;
                setCartItems(data.items);
                setSelectedItems(data.items.map(item => item.id));
            } else {
                throw new Error('Failed to fetch cart items');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleItemCheckboxChange = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(itemId)) {
                return prevSelectedItems.filter((id) => id !== itemId);
            } else {
                return [...prevSelectedItems, itemId];
            }
        });
    };

    const handleUpdateCart = async () => {
        try {
            await axiosInstance.post('cart/create/', { items: selectedItems, country: "ESP" });
            console.log('Cart updated successfully');
        } catch (error) {
            console.log(error);
        }
        handleCloseCart();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 w-3/5">
                <div className="flex justify-end">
                    <button className="text-xl font-bold" onClick={handleCloseCart}>
                        X
                    </button>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">Cart Items</h2>
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className="py-2 pl-4 text-left bg-purple-200">Name</th>
                        <th className="py-2 pl-4 text-left bg-purple-200">Price</th>
                        <th className="py-2 pl-4 text-left bg-purple-200">Selected Items</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td className="py-2 pl-4">{item.name}</td>
                            <td className="py-2 pl-4">{item.price}</td>
                            <td className="py-2 pl-4">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleItemCheckboxChange(item.id)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-8">
                    <button
                        className="px-8 py-4 ml-4 text-white bg-green-500 rounded"
                        onClick={handleUpdateCart}
                    >
                        Update Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItemsPopup;
