import fs from "fs";
import { uuidv7 } from "uuidv7";

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

export const getImageTmpPathFromFile = async(imageFile: any) => {

    // Convert base64 image file to a buffer
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