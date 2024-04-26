// Function to convert base 64 string to JSON
export const base64ToJSON = (text: string) => {
    const json = JSON.parse(
        Buffer.from(text, 'base64').toString()
    );
    return json;
}