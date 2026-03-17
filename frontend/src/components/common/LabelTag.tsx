import { mockLabels } from '../../mock-data/labels';

interface LabelTagProps {
  text: string; // This is the label ID
}

export const LabelTag = ({ text }: LabelTagProps) => {
  const label = mockLabels.find(l => l.id === text);
  
  if (!label) return null;

  return (
    <span 
      className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider transition-all"
      style={{ 
        backgroundColor: `${label.color}15`, 
        color: label.color, 
        borderColor: `${label.color}30` 
      }}
    >
      {label.title}
    </span>
  );
};
