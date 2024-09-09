
// import axios from "axios";
// import { huggingApi } from "../api";
// import { base64 } from "./fileToUrl";

// // Function to generate image using Hugging Face API
// const generateImage = async (data: string): Promise<Blob> => {
//     console.log('generate2', JSON.stringify(data));
//     const huggingFaceUrl = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

//     const response = await axios.post(
//         huggingFaceUrl,
//         data,
//         {
//             headers: {
//                 Authorization: `Bearer ${huggingApi}`,
//                 "Content-Type": "application/json",
//             },
//             responseType: 'blob',
//         }
//     );
//     if (response.data) {
//         console.log(response.data, 'dataaaaaaaaa');
//         return response.data; // This is a Blob object
//     }

// }

// export const getAiGeneratedImage = async (text: string, setImage: (image: string) => void) => {
//     try {
//         // Get the Blob from the API
//         const blob = await generateImage(text);
//         if (blob) {
//             // Convert Blob to File object
//             const file = new File([blob], "generated-image.jpg", { type: blob.type });
//             base64(file, setImage);
//         } else {
//             return null
//         }


//     } catch (error) {
//         console.log(error);
//         return error

//     }
// }

import axios from "axios";
import { huggingApi } from "../api";
import { base64 } from "./fileToUrl";
import { generateError } from "../alerts/alerts";

// Function to generate image using Hugging Face API
const generateImage = async (data: string): Promise<Blob | null> => {
    try {
        console.log('generate2', JSON.stringify(data));
        const huggingFaceUrl = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

        const response = await axios.post(
            huggingFaceUrl,
            data,
            {
                headers: {
                    Authorization: `Bearer ${huggingApi}`,
                    "Content-Type": "application/json",
                },
                responseType: 'blob',  // Ensures the response is in Blob format
            }
        );

        if (response.data) {
            console.log(response.data, 'dataaaaaaaaa');
            return response.data as Blob; // Return Blob object if data exists
        } else {
            return null; // Return null if no data is returned
        }
    } catch (error) {
        console.error('Error generating image:', error);
        return null;  // Return null in case of an error
    }
}

export const getAiGeneratedImage = async (text: string, setImage: (image: string) => void) => {
    try {
        // Get the Blob from the API
        const blob = await generateImage(text);
        if (blob) {
            // Convert Blob to File object
            const file = new File([blob], "generated-image.jpg", { type: blob.type });
            base64(file, setImage);
        } else {
            console.warn("No blob data received");
            return null; // Return null if blob is not available
        }
    } catch (error) {
        console.error('Error in getAiGeneratedImage:', error);
        generateError('Error while generating Image')
        return error;
    }
}
