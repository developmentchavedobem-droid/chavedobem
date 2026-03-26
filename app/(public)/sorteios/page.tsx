import HorizontalCard from "@/src/components/HorizontalCard";
import { Campaign } from "@/app/generated/prisma/client";

interface Props {
  campaigns: Campaign[];
}

export default function Campaigns({ campaigns }: Props) {
  return (
    <div className="min-h-75 w-full bg-zinc-100 font-sans pb-20">
      <div className="w-full sm:max-w-5xl h-full mx-auto flex flex-col items-center px-5">
        <h3 className="text-[#053B80] text-2xl font-bold mb-8">Participe conosco!</h3>
        
        {campaigns.length === 0 ? (
          <p className="text-gray-500">Nenhuma campanha disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {campaigns.map((campaign) => (
              <HorizontalCard 
                key={campaign.id} 
                campaign={campaign} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}