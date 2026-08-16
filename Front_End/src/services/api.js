const API_URL = "http://localhost:5000/api";

export const getSkills = async () => {
    const response = await fetch(`${API_URL}/skills`);

    if (!response.ok) {
        throw new Error("Failed to fetch skills");
    }

    return response.json();
};


export const getUserSkills = async () => {
    const response = await fetch(`${API_URL}/user-skills`);

    if (!response.ok) {
        throw new Error("Failed to fetch user skills");
    }

    return response.json();
};


export const sendSwapRequest = async (requestData) => {
    const response = await fetch(`${API_URL}/swap-requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to send swap request");
    }

    return data;
};


export const getSwapRequests = async (userId) => {
    const response = await fetch(
        `${API_URL}/swap-requests/user/${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch swap requests");
    }

    return response.json();
};


export const updateSwapRequest = async (requestId, status) => {
    const response = await fetch(
        `${API_URL}/swap-requests/${requestId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update swap request");
    }

    return data;
};