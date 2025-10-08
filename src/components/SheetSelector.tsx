import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSpreadsheet } from 'lucide-react';

interface SheetSelectorProps {
  sheets: string[];
  selectedSheet: string;
  onSheetSelect: (sheet: string) => void;
}

export const SheetSelector = ({ sheets, selectedSheet, onSheetSelect }: SheetSelectorProps) => {
  return (
    <Card className="shadow-card hover:shadow-md transition-shadow">
      <div className="p-4 border border-border rounded-lg bg-accent/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-accent/20">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Select Excel Sheet
            </label>
            <Select value={selectedSheet} onValueChange={onSheetSelect}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Choose a sheet" />
              </SelectTrigger>
              <SelectContent>
                {sheets.map((sheet) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};
