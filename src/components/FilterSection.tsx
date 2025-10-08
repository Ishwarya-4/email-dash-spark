import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FilterSectionProps {
  months: string[];
  businessUnits: string[];
  nurtureNames: string[];
  nurtureTypes: string[];
  selectedMonth: string;
  selectedBusinessUnit: string;
  selectedNurtureName: string;
  selectedNurtureType: string;
  onMonthChange: (value: string) => void;
  onBusinessUnitChange: (value: string) => void;
  onNurtureNameChange: (value: string) => void;
  onNurtureTypeChange: (value: string) => void;
}

export const FilterSection = ({
  months,
  businessUnits,
  nurtureNames,
  nurtureTypes,
  selectedMonth,
  selectedBusinessUnit,
  selectedNurtureName,
  selectedNurtureType,
  onMonthChange,
  onBusinessUnitChange,
  onNurtureNameChange,
  onNurtureTypeChange,
}: FilterSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="month-filter" className="text-sm font-medium">Month</Label>
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger id="month-filter" className="w-full bg-card">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">All Months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="business-unit-filter" className="text-sm font-medium">Business Unit</Label>
        <Select value={selectedBusinessUnit} onValueChange={onBusinessUnitChange}>
          <SelectTrigger id="business-unit-filter" className="w-full bg-card">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">All Units</SelectItem>
            {businessUnits.map((unit) => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nurture-name-filter" className="text-sm font-medium">Nurture Name</Label>
        <Select value={selectedNurtureName} onValueChange={onNurtureNameChange}>
          <SelectTrigger id="nurture-name-filter" className="w-full bg-card">
            <SelectValue placeholder="All Nurture Names" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">All Nurture Names</SelectItem>
            {nurtureNames.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nurture-type-filter" className="text-sm font-medium">Nurture Type</Label>
        <Select value={selectedNurtureType} onValueChange={onNurtureTypeChange}>
          <SelectTrigger id="nurture-type-filter" className="w-full bg-card">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">All Types</SelectItem>
            {nurtureTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
