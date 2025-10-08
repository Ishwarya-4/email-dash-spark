import { useState, useMemo } from 'react';
import { FileUpload } from './FileUpload';
import { SheetSelector } from './SheetSelector';
import { FilterSection } from './FilterSection';
import { KPICards } from './KPICards';
import { ChartsGrid } from './ChartsGrid';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { parseFile, getExcelSheets, EmailData } from '@/utils/dataParser';
import { toast } from 'sonner';

export const Dashboard = () => {
  const [data, setData] = useState<EmailData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('all');
  const [selectedNurtureName, setSelectedNurtureName] = useState('all');
  const [selectedNurtureType, setSelectedNurtureType] = useState('all');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    try {
      setCurrentFile(file);
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      // Check if it's an Excel file
      if (['.xls', '.xlsx', '.xlsm'].includes(extension)) {
        const sheets = await getExcelSheets(file);
        
        if (sheets.length > 1) {
          // Multiple sheets - let user select
          setAvailableSheets(sheets);
          setSelectedSheet(sheets[0]);
          toast.info('Multiple sheets detected. Please select a sheet.');
        } else {
          // Single sheet - parse directly
          const parsedData = await parseFile(file);
          setData(parsedData);
          setAvailableSheets([]);
          setSelectedSheet('');
          toast.success('File uploaded successfully!');
        }
      } else {
        // Non-Excel file - parse directly
        const parsedData = await parseFile(file);
        setData(parsedData);
        setAvailableSheets([]);
        setSelectedSheet('');
        toast.success('File uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to parse file. Please check the format.');
      console.error('Parse error:', error);
    }
  };

  const handleSheetSelect = async (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (currentFile) {
      try {
        const parsedData = await parseFile(currentFile, sheetName);
        setData(parsedData);
        toast.success(`Loaded data from sheet: ${sheetName}`);
      } catch (error) {
        toast.error('Failed to parse selected sheet.');
        console.error('Parse error:', error);
      }
    }
  };

  const handleClear = () => {
    setData([]);
    setCurrentFile(null);
    setAvailableSheets([]);
    setSelectedSheet('');
    setSelectedMonth('all');
    setSelectedBusinessUnit('all');
    setSelectedNurtureName('all');
    setSelectedNurtureType('all');
    toast.info('Dashboard cleared');
  };

  // Extract unique values for filters
  const { months, businessUnits, nurtureNames, nurtureTypes } = useMemo(() => {
    const uniqueMonths = [...new Set(data.map(d => d.month))].filter(Boolean).sort();
    const uniqueBusinessUnits = [...new Set(data.map(d => d.business_unit))].filter(Boolean).sort();
    const uniqueNurtureNames = [...new Set(data.map(d => d.nurture_name))].filter(Boolean).sort();
    const uniqueNurtureTypes = [...new Set(data.map(d => d.nurture_type))].filter(Boolean).sort();
    
    return {
      months: uniqueMonths,
      businessUnits: uniqueBusinessUnits,
      nurtureNames: uniqueNurtureNames,
      nurtureTypes: uniqueNurtureTypes,
    };
  }, [data]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (selectedMonth !== 'all' && item.month !== selectedMonth) return false;
      if (selectedBusinessUnit !== 'all' && item.business_unit !== selectedBusinessUnit) return false;
      if (selectedNurtureName !== 'all' && item.nurture_name !== selectedNurtureName) return false;
      if (selectedNurtureType !== 'all' && item.nurture_type !== selectedNurtureType) return false;
      return true;
    });
  }, [data, selectedMonth, selectedBusinessUnit, selectedNurtureName, selectedNurtureType]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSent = filteredData.reduce((sum, item) => sum + item.total_sent, 0);
    const delivered = filteredData.reduce((sum, item) => sum + item.delivered, 0);
    const bounces = filteredData.reduce((sum, item) => sum + item.bounces, 0);
    const bounceRate = totalSent > 0 ? (bounces / totalSent) * 100 : 0;
    
    return { totalSent, delivered, bounces, bounceRate };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Email Performance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Upload your email campaign data to visualize performance metrics
          </p>
        </div>

        {/* Upload and Clear Button Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full sm:w-auto gap-2"
            disabled={data.length === 0 && availableSheets.length === 0}
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </Button>
        </div>

        {/* Sheet Selector */}
        {availableSheets.length > 1 && (
          <SheetSelector
            sheets={availableSheets}
            selectedSheet={selectedSheet}
            onSheetSelect={handleSheetSelect}
          />
        )}

        {/* Filters */}
        {data.length > 0 && (
          <FilterSection
            months={months}
            businessUnits={businessUnits}
            nurtureNames={nurtureNames}
            nurtureTypes={nurtureTypes}
            selectedMonth={selectedMonth}
            selectedBusinessUnit={selectedBusinessUnit}
            selectedNurtureName={selectedNurtureName}
            selectedNurtureType={selectedNurtureType}
            onMonthChange={setSelectedMonth}
            onBusinessUnitChange={setSelectedBusinessUnit}
            onNurtureNameChange={setSelectedNurtureName}
            onNurtureTypeChange={setSelectedNurtureType}
          />
        )}

        {/* KPIs */}
        {filteredData.length > 0 && (
          <KPICards
            totalSent={kpis.totalSent}
            delivered={kpis.delivered}
            bounces={kpis.bounces}
            bounceRate={kpis.bounceRate}
          />
        )}

        {/* Charts */}
        {filteredData.length > 0 && (
          <ChartsGrid data={filteredData} />
        )}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Upload a file to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
