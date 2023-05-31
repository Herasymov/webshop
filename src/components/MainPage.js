import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosAPI";
import CartItemsPopup from './CartItemsPopup';

const MainPage = () => {
    const navigate = useNavigate();
    const userToken = localStorage.getItem('token');
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCartCreated, setIsCartCreated] = useState(false);
    const [cartId, setCartId] = useState(null);
    const [showCartItems, setShowCartItems] = useState(false);
    const [username, setUsername] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('1'); // Add default value '1'

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        } else {
            fetchCart();
            fetchItems();
            fetchUsername();
            fetchCountries();
        }
    }, [userToken, navigate]);

    const fetchCart = async () => {
        try {
            const timestamp = Date.now();
            const response = await axiosInstance.get(`cart/check_cart/?timestamp=${timestamp}`);
            if (response.status === 200) {
                const data = await response.data;
                setCartId(data.id);
                setIsCartCreated(true);
            } else if (response.status === 404) {
                setIsCartCreated(false);
            } else {
                throw new Error('Failed to fetch cart');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchItems = async () => {
        try {
            const timestamp = Date.now();
            const response = await axiosInstance.get(`cart/items/?timestamp=${timestamp}`);
            if (response.status === 200) {
                const data = await response.data;
                setItems(data);
            } else {
                throw new Error('Failed to fetch cart items');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsername = async () => {
        try {
            const timestamp = Date.now();
            const response = await axiosInstance.get(`get_username/?timestamp=${timestamp}`);
            if (response.status === 200) {
                const data = await response.data;
                setUsername(data.username);
            } else {
                throw new Error('Failed to fetch username');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axiosInstance.get('cart/countries/');
            if (response.status === 200) {
                const data = await response.data;
                setCountries(data);
            } else {
                throw new Error('Failed to fetch countries');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('logout/', { 'refresh_token': localStorage.getItem('refresh_token') });
            navigate('/login');
            localStorage.clear();
            caches.keys().then(function(names) {
                for (let name of names) caches.delete(name);
            });
            clearCookies();
        } catch (error) {
            console.log(error);
        }
    };

    const clearCookies = () => {
        const cookies = document.cookie.split(';');

        cookies.forEach((cookie) => {
            const cookieName = cookie.split('=')[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    };

    const handleOpenCart = async () => {
        await fetchCart();
        setShowCartItems(true);
    };

    const handleCloseCart = () => {
        setShowCartItems(false);
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

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handleAddToCart = async () => {
        try {
            const selectedItemsData = selectedItems.map(itemId => {
                const selectedItem = items.find(item => item.id === itemId);
                return selectedItem.id;
            });

            await fetchCart();

            await axiosInstance.post('cart/create/', { items: selectedItemsData, country: selectedCountry });

            setIsCartCreated(true);
            setSelectedItems([]); // Clear the selected items
            alert('Thank you for creating a cart!');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-purple-100">
            <nav className="flex items-center justify-between px-6 py-4 bg-purple-600">
                <div className="text-white">
                    <span className="mr-2">Logged in as: {username}</span>
                </div>
                <div>
                    <button
                        className={`px-4 py-2 mr-2 text-white bg-purple-800 rounded ${!isCartCreated && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handleOpenCart}
                        disabled={!isCartCreated}
                    >
                        Open Cart
                    </button>
                    <button
                        className="px-4 py-2 text-white bg-purple-800 rounded"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="flex items-center justify-start px-6 py-4 bg-white">
                <label htmlFor="countrySelect" className="mr-2">Country:</label>
                <select id="countrySelect" value={selectedCountry} onChange={handleCountryChange}>
                    {countries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                </select>
            </div>

            <table className="w-full mt-8">
                <thead>
                <tr>
                    <th className="py-2 pl-4 text-center bg-purple-200">Name</th>
                    <th className="py-2 pl-4 text-center bg-purple-200">Price</th>
                    <th className="py-2 pl-4 text-center bg-purple-200">Add to Cart</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td className="py-2 pl-4 text-center">{item.name}</td>
                        <td className="py-2 pl-4 text-center">{item.price}</td>
                        <td className="py-2 pl-4 text-center">
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
                    className={`px-8 py-4 text-white bg-yellow-500 rounded hover:bg-yellow-600`}
                    onClick={handleAddToCart}
                >
                    Add Items to Cart
                </button>
            </div>

            {showCartItems && (
                <CartItemsPopup cartId={cartId} handleCloseCart={handleCloseCart} />
            )}
        </div>
    );
};

export default MainPage;
