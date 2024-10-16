import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import axios from 'axios';

export const replaceKeys = {
    '1': 'serialNumber',
    '2': 'date',
    '3': 'time',
    '4': 'station',
    '5': 'pumpColumn',
    '6': 'product',
    '7': 'quantity',    
    '8': 'unitPrice',
    '9': 'totalAmountVnd',
    '10': 'paymentStatus',
    '11': 'customerId',
    '12': 'customerName',
    '13': 'customerType',
    '14': 'paymentDate',
    '15': 'employee',
    '16': 'licensePlate',
    '17': 'invoiceStatus'
};

export interface ExcelDataInterface {
    [key: string]: any;
}


export const readExcelFile = async (url: string): Promise<ExcelDataInterface[]> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(url);
    const data: { [key: string]: any }[] = [];
    workbook.eachSheet((worksheet, sheetId) => {
        console.log(`Sheet ID: ${sheetId}, Sheet Name: ${worksheet.name}`);
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 8) {
                const obj = {};

                const rowValues = {
                    ...row.values,
                };

                for (let key in replaceKeys) {
                    obj[replaceKeys[key]] = rowValues[key] ? rowValues[key] : null;
                }

                data.push(obj);
            }

        });
    });
    return data;
};