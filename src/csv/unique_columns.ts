import csvParse from 'csv-parse';

import { firstLine } from '../lib/first_line';

export async function getUniqueColumns(inputFiles: string[]): Promise<string[]> {
    const uniqueColumnsSet: Set<string> = new Set();

    for (const inputFile of inputFiles) {
        const headerString: string = await firstLine(inputFile);
        const header = await getColumnHeaders(inputFile, headerString);

        header.forEach((column) => {
            uniqueColumnsSet.add(column);
        });
    }

    const uniqueColumns: string[] = Array.from(uniqueColumnsSet);

    return uniqueColumns;
}

function getColumnHeaders(inputFile: string, headerString: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        csvParse(headerString, (error, result) => {
            if (error) {
                return reject(error);
            }

            if (!Array.isArray(result) || result.length < 1) {
                return reject(`invalid csv header ${inputFile}`);
            }

            resolve(result[0]);
        });
    });
}
