import axiosInstance from "../axiosAPI";

const refreshAccessToken = async (refreshToken) => {
    console.log(1)
    try {
        const timestamp = Date.now();
        const response = await axiosInstance.post(`token/refresh/?timestamp=${timestamp}`, {
            refresh: refreshToken,
        });

        if (response.status === 200) {
            const data = response.data;
            const token = data.access;
            localStorage.setItem('token', token);
            return token;
        } else {
            throw new Error('Token refresh failed');
        }
    } catch (error) {
        throw new Error('Token refresh failed');
    }
};

export default refreshAccessToken;