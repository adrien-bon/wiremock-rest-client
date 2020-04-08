import log from 'loglevel';
import * as fs from 'fs';
import * as path from 'path';

const logger = log.getLogger('wiremock-rest-client');

export class FileUtil {
    static getFileContent(fileName: string): string {
        try {
            return fs.readFileSync(path.join(process.cwd(), fileName), 'utf8');
        } catch (error) {
            logger.error(`Error: ${error}`);
            throw new Error(error);
        }
    }

    static getFilesFromDir(directoryName: string, files: string[] = []): string[] {
        const fullDirectoryPath = path.join(process.cwd(), directoryName);

        try {
            fs.readdirSync(fullDirectoryPath).forEach((fileName) => {
                const fullPath = path.join(fullDirectoryPath, fileName);
                if (fs.lstatSync(fullPath).isDirectory()) {
                    this.getFilesFromDir(path.join(directoryName, fileName), files);
                } else {
                    files.push(path.join(directoryName, fileName));
                }
            });
        } catch (error) {
            logger.error(`Error: ${error}`);
            throw new Error(error);
        }

        return files;
    }
}
