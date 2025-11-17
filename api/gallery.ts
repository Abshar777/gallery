import axios from "axios";

export const getGallery = async (screenId: string) => {
    const response = await axios.get(`/api/gallery?screenId=${screenId}`);  
    return response.data;
}

export const createGallery = async (screenId: string, image: string) => {
    const response = await axios.post(`/api/gallery?screenId=${screenId}`, { image });
    return response.data;
}

export const updateGallery = async (screenId: string, image: string) => {
    const response = await axios.put(`/api/gallery?screenId=${screenId}`, { image });
    return response.data;
}


export const deleteGallery = async (id: string) => {
    const response = await axios.delete(`/api/gallery`, { data: { id } });
    return response.data;
}