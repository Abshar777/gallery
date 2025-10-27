import axios from "axios";

export const getScreens = async () => {
    const response = await axios.get("/api/screen");
    return response.data;
}

export const createScreen = async () => {
    const response = await axios.post("/api/screen");

    return response.data;
}



export const deleteScreen = async (id: string) => {
    const response = await axios.delete(`/api/screen/${id}`);
    return response.data;
}