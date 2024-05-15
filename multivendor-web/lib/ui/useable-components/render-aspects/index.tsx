import { ratingAspects } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import { Button } from "primereact/button";
import { twMerge } from "tailwind-merge";

const AspectButton = ({
  aspect,
  selected,
  onToggle,
}: {
  aspect: string; 
  selected: boolean; 
  onToggle: (aspect: string) => void; 
}) => (
  <Button
    onClick={() => onToggle(aspect)}
    className={twMerge(
      "px-4 py-2 rounded-full border border-gray-400  text-sm font-medium transition-colors",
      selected
        ? "bg-primary-color text-white border-primary-color" 
        : "bg-white dark:text-gray-300 dark:bg-gray-600 text-gray-700 border-gray-400 hover:bg-gray-50" 
    )}
  >
    {aspect}
  </Button>
);

function RenderAspects({
  selectedAspects,
  handleAspectToggle,
}: {
  selectedAspects: string[]; 
  handleAspectToggle: (aspect: string) => void; 
}) {
  const t = useTranslations()
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {ratingAspects?.map((aspect) => (
        <AspectButton
          key={aspect}
          aspect={t(aspect)}
          selected={selectedAspects.includes(aspect)}
          onToggle={handleAspectToggle}
        />
      ))}
    </div>
  );
}
export default RenderAspects;
