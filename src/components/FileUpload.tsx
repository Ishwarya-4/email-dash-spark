import { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    const validExtensions = ['.csv', '.xls', '.xlsx', '.xlsm', '.json'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (validExtensions.includes(fileExtension)) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      alert('Please upload a valid file format (.csv, .xls, .xlsx, .xlsm, .json)');
    }
  };

  return (
    <Card className="shadow-card hover:shadow-md transition-shadow">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 border-2 border-dashed rounded-lg transition-all ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border bg-card'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept=".csv,.xls,.xlsx,.xlsm,.json"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            
            {fileName ? (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-success" />
                <span className="font-medium text-foreground">{fileName}</span>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports .csv, .xls, .xlsx, .xlsm, .json
                </p>
              </div>
            )}
          </div>
        </label>
      </div>
    </Card>
  );
};
