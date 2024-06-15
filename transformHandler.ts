import { FormattedData, FileData } from "./interfaces";

export const transformHandler = (data: FileData[]): FormattedData => {
    const formattedData: FormattedData = {}; // Initialize an empty object to store the formatted data

    // Loop through each item in the data array
    data.forEach(item => {
        const parts = item.fileUrl.split('/'); // Split the file URL into parts using '/' as the delimiter
        const ip = parts[2]; // Extract the IP address
        const directory = parts[3]; // Extract directory
        const subDirectory = parts.length > 5 ? parts[4] : null; // Extract the subdirectory if it exists
        const secondSubDirectory = subDirectory && parts.length > 6 ? parts[5] : null; // Extract the second subdirectory if it exists
        const file = secondSubDirectory ? parts[6] : subDirectory ? parts[5] : parts[4]; // Determine the file name based on the structure

        if (!file) {
            return; // If no file name is found, skip this iteration
        }

        if (!formattedData[ip]) {
            formattedData[ip] = {}; // Initialize the IP entry if it doesn't exist
        }

        if (!formattedData[ip][directory]) {
            formattedData[ip][directory] = []; // Initialize the directory entry if it doesn't exist
        }

        if (subDirectory) {
            // Find or create an entry for the subdirectory
            let subDirEntry = formattedData[ip][directory].find(
                entry => typeof entry === 'object' && entry.hasOwnProperty(subDirectory)
            ) as { [subDirectory: string]: (string | { [secondSubDirectory: string]: string[] })[] };

            if (!subDirEntry) {
                subDirEntry = { [subDirectory]: [] }; // Create a new subdirectory entry if it doesn't exist
                formattedData[ip][directory].push(subDirEntry);  // Add it to the directory
            }

            if (secondSubDirectory) {
                // Find or create an entry for the second subdirectory
                let secondSubDirEntry = subDirEntry[subDirectory].find(
                    entry => typeof entry === 'object' && entry.hasOwnProperty(secondSubDirectory)
                ) as { [secondSubDirectory: string]: string[] };

                if (!secondSubDirEntry) {
                    secondSubDirEntry = { [secondSubDirectory]: [] }; // Create a new second subdirectory entry if it doesn't exist
                    subDirEntry[subDirectory].push(secondSubDirEntry); // Add it to the subdirectory
                }

                secondSubDirEntry[secondSubDirectory].push(file); // Add the file to the second subdirectory
            } else {
                subDirEntry[subDirectory].push(file); // Add the file to the subdirectory
            }
        } else {
            formattedData[ip][directory].push(file); // If no subdirectories, add the file directly to the directory
        }
    });

    // Return the formatted data
    return formattedData;
};
