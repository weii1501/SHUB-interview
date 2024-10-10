import { ExcelDataInterface, replaceKeys } from "../utils/XlsxHandler";
import { parse, isAfter, isBefore, isEqual } from 'date-fns';
import path from "path";
import ExcelJS from 'exceljs';


class FileServiceClass {
    async getData_v2(query: any, largestFile: any): Promise<ExcelDataInterface[]> {
        const TITLE_ROW = 8;

        const formatString = 'HH:mm:ss';
        const { start, end } = query
        const URL = path.join(__dirname, '../../uploads', largestFile);
        const startDate = start ? parse(start, formatString, new Date()) : null;
        const endDate = end ? parse(end, formatString, new Date()) : null;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(URL);
        const data: ExcelDataInterface[] = [];
        workbook.eachSheet((worksheet, sheetId) => {
            console.log(`Sheet ID: ${sheetId}, Sheet Name: ${worksheet.name}`);
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > TITLE_ROW) {
                    let checkDate: Date = new Date();
                    const obj = {};
                    const rowValues = {
                        ...row.values,
                    };

                    for (let key in replaceKeys) {
                        obj[replaceKeys[key]] = rowValues[key] ? rowValues[key] : null;
                        if (replaceKeys[key] === 'time') {
                            try {
                                checkDate = parse(rowValues[key], formatString, new Date());
                            } catch (error) {
                                continue;
                            }
                            
                        }
                    }

                    if (!startDate && !endDate) {
                        data.push(obj);
                    } else if (!startDate && endDate) {
                        if (isBefore(checkDate, endDate) || isEqual(checkDate, endDate)) {
                            data.push(obj);
                        }
                    } else if (startDate && !endDate) {
                        if (isAfter(checkDate, startDate) || isEqual(checkDate, startDate)) {
                            data.push(obj);
                        }
                    } else if (startDate && endDate) {
                        if ((isAfter(checkDate, startDate) || isEqual(checkDate, startDate)) &&
                            (isBefore(checkDate, endDate) || isEqual(checkDate, endDate))) {
                            data.push(obj);
                        }
                    }

                }

            });
        });

        return data;
    }

}

const FileService = new FileServiceClass();

export default FileService;