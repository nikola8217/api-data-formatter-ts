export interface FileData {
    fileUrl: string;
}

export interface FormattedData {
    [ip: string]: {
        [directory: string]: (string | { [subDirectory: string]: (string | { [secondSubDirectory: string]: string[] })[] })[];
    };
}