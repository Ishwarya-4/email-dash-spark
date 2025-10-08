import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface EmailData {
  month: string;
  business_unit: string;
  nurture_name: string;
  nurture_type: string;
  total_sent: number;
  delivered: number;
  bounces: number;
  opens: number;
  clicks: number;
  unsubscribes: number;
}

// Convert Excel serial date to readable month-year string
const excelSerialToDate = (serial: number): string => {
  if (typeof serial !== 'number' || serial < 1) {
    return 'Unknown';
  }
  
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date_info.getUTCMonth()];
  const year = date_info.getUTCFullYear();
  
  return `${month}-${year}`;
};

// Normalize date string or serial to month-year format
const normalizeMonth = (value: any): string => {
  if (typeof value === 'number') {
    return excelSerialToDate(value);
  }
  
  if (typeof value === 'string') {
    // Try to parse as date
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]}-${date.getFullYear()}`;
    }
    return value;
  }
  
  return 'Unknown';
};

export const parseCSV = (file: File): Promise<EmailData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row: any) => ({
          month: normalizeMonth(row.month || row.Month),
          business_unit: String(row.business_unit || row['Business Unit'] || ''),
          nurture_name: String(row.nurture_name || row['Nurture Name'] || ''),
          nurture_type: String(row.nurture_type || row['Nurture Type'] || ''),
          total_sent: Number(row.total_sent || row['Total Sent'] || 0),
          delivered: Number(row.delivered || row.Delivered || 0),
          bounces: Number(row.bounces || row.Bounces || 0),
          opens: Number(row.opens || row.Opens || 0),
          clicks: Number(row.clicks || row.Clicks || 0),
          unsubscribes: Number(row.unsubscribes || row.Unsubscribes || 0),
        }));
        resolve(data);
      },
      error: (error) => reject(error),
    });
  });
};

export const getExcelSheets = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: false });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseExcel = (file: File, sheetName?: string): Promise<EmailData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: false });
        const selectedSheet = sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[selectedSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        
        const parsedData = jsonData.map((row: any) => ({
          month: normalizeMonth(row.month || row.Month),
          business_unit: String(row.business_unit || row['Business Unit'] || row['Bussiness Unit'] || ''),
          nurture_name: String(row.nurture_name || row['Nurture Name'] || ''),
          nurture_type: String(row.nurture_type || row['Nurture Type'] || row['Type of Nurture'] || ''),
          total_sent: Number(row.total_sent || row['Total Sent'] || row.Sent || 0),
          delivered: Number(row.delivered || row.Delivered || 0),
          bounces: Number(row.bounces || row.Bounces || 0),
          opens: Number(row.opens || row.Opens || row['Total Open'] || 0),
          clicks: Number(row.clicks || row.Clicks || row['Total Clicks'] || 0),
          unsubscribes: Number(row.unsubscribes || row.Unsubscribes || row['Opt out'] || 0),
        }));
        
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseJSON = (file: File): Promise<EmailData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const data = (Array.isArray(jsonData) ? jsonData : [jsonData]).map((row: any) => ({
          month: normalizeMonth(row.month || row.Month),
          business_unit: String(row.business_unit || row['Business Unit'] || ''),
          nurture_name: String(row.nurture_name || row['Nurture Name'] || ''),
          nurture_type: String(row.nurture_type || row['Nurture Type'] || ''),
          total_sent: Number(row.total_sent || row['Total Sent'] || 0),
          delivered: Number(row.delivered || row.Delivered || 0),
          bounces: Number(row.bounces || row.Bounces || 0),
          opens: Number(row.opens || row.Opens || 0),
          clicks: Number(row.clicks || row.Clicks || 0),
          unsubscribes: Number(row.unsubscribes || row.Unsubscribes || 0),
        }));
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const parseFile = async (file: File, sheetName?: string): Promise<EmailData[]> => {
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  switch (extension) {
    case '.csv':
      return parseCSV(file);
    case '.xls':
    case '.xlsx':
    case '.xlsm':
      return parseExcel(file, sheetName);
    case '.json':
      return parseJSON(file);
    default:
      throw new Error('Unsupported file format');
  }
};
