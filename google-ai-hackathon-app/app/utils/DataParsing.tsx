// Function to convert JSON to base 64 string
export const jsonToBase64 = (json: any) => {
    const jsonString = JSON.stringify(json);
    const base64 =  Buffer.from(jsonString).toString("base64");
    return base64;
}

// Function to convert base 64 string to JSON
export const base64ToJSON = (text: string) => {
    const json = JSON.parse(
        Buffer.from(text, 'base64').toString()
    );
    return json;
}

