import { ExcelDataInterface, replaceKeys } from "../utils/XlsxHandler";
import { parse, isAfter, isBefore, isEqual, differenceInMilliseconds } from 'date-fns';
import path from "path";
import ExcelJS from 'exceljs';

const formatString = 'HH:mm:ss';

class FileServiceClass {
    async getData_v2(query: any, largestFile: any): Promise<any> {
        const TIME_COL = 3;

        const { start, end } = query
        const URL = path.join(__dirname, '../../uploads', largestFile);
        const startDate = parse(start, formatString, new Date());
        const endDate = parse(end, formatString, new Date());

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(URL);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error("Worksheet not found");
        }
        const LAST_ROW = worksheet.lastRow?.number ?? 0;

        const data: ExcelDataInterface[] = [];

        const endRow = this.FindRowIndexOfTime(worksheet, endDate);
        let rowIndex = endRow;

        while (rowIndex <= LAST_ROW) {
            const row = worksheet.getRow(rowIndex);
            const rowValues = {
                ...row.values,
            };

            if (startDate >= parse(rowValues[TIME_COL], formatString, new Date())) {
                break;
            }

            const obj = {};
            for (let key in replaceKeys) {
                obj[replaceKeys[key]] = rowValues[key] ? rowValues[key] : null;
            }
            data.push(obj);
            rowIndex++;
        }

        return data;
    }

    FindRowIndexOfTime(worksheet: ExcelJS.Worksheet, date: Date): number {
        const FIRST_ROW = 9;
        const LAST_ROW = worksheet.lastRow?.number ?? 0;

        const firstCellValue = worksheet.getRow(FIRST_ROW).getCell(3).value;

        if (!firstCellValue || typeof firstCellValue !== 'string') {
            return FIRST_ROW;
        }

        const firstTime = parse(firstCellValue, formatString, new Date());
        if (date > firstTime) {
            return FIRST_ROW;
        }

        let left = FIRST_ROW; // Bắt đầu từ hàng thứ 9 (sau TITLE_ROW là hàng 8)
        let right = LAST_ROW;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const midRow = worksheet.getRow(mid);
            const midCellValue = midRow.getCell(3).value;

            if (!midCellValue || typeof midCellValue !== 'string') {
                // Nếu giá trị ô không phải là chuỗi (không phải thời gian hợp lệ), bỏ qua hàng này
                left = mid + 1;
                continue;
            }

            const midTime = parse(midCellValue, formatString, new Date());

            if (midTime === date) {
                return mid;
            } else if (midTime > date) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return left;
    }

}

const FileService = new FileServiceClass();

export default FileService;