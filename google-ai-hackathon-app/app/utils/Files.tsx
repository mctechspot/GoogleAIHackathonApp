import fs from "fs";
import { uuidv7 } from "uuidv7";

// Function to accept base64String, convert it to a file and write it to /tmp
export const getImageTmpPathFromBase64String =  (base64String: string) => {
    // Convert base64 image string to a buffer
    const imageData: any = Buffer.from(base64String, 'base64');

    // Initialise id, file name and file path at /tmp for image
    const imageUUID: string = uuidv7();
    const tmpImageName:string = `image_${imageUUID}.png`;
    const tmpImagePath: string = `/tmp/${tmpImageName}`;

    // Save generated images to in /tmp
    fs.writeFileSync(tmpImagePath, imageData);
    return {
        imageUUID: imageUUID,
        imageName: tmpImageName,
        imagePath: tmpImagePath,
    };
}

// Function to accept file and write it to /tmp
export const getImageTmpPathFromFile = async(imageFile: any) => {

    // Convert image file to a buffer
    const imageData: any = Buffer.from(await imageFile.arrayBuffer());

    // Initialise id, file name and file path at /tmp for image
    const imageUUID: string = uuidv7();
    const tmpImageName:string = `image_${imageUUID}.png`;
    const tmpImagePath: string = `/tmp/${tmpImageName}`;

    // Save generated images to in /tmp
    fs.writeFileSync(tmpImagePath, imageData);
    return {
        imageUUID: imageUUID,
        imageName: tmpImageName,
        imagePath: tmpImagePath,
    };
}

// Functon to accept filePath and convert it to base64 string
export const filePathToBase64 = (filePath: string) => {
    const fileData = fs.readFileSync(filePath);    
    const base64String = fileData.toString('base64');
    return base64String;
}

// Function to check for image size and mime type warnings
export const checkImageCompatibility = (image: File) => {
    const warnings: string[] = [];

    // Check for appropriate file extension
    const imageTypeExploded: string[] = image.type.split("/");
    const fileExtension: string = imageTypeExploded[imageTypeExploded.length - 1];
    const allowedFileExtensions: string[] = ["jpeg", "jpg", "png"];
    if(!allowedFileExtensions.includes(fileExtension)){
        warnings.push("Only images with extensions jpeg, jpg and png are allowed.");
    }

    // Check for appropriate file size
    const file_size: number = image.size;
    if(file_size >= 27000000){
        warnings.push("File size is too large. Choose a file of a size lower than 20 MB.")
    }

    return warnings;
}