import HorizontalCard from "@/src/components/HorizontalCard";

export default function Campaigns() {
  const list = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className="min-h-screen w-full pt-10 bg-zinc-50 font-sans">
        <div className="w-full sm:max-w-4xl h-full mx-auto flex flex-col items-center py-10 px-5">
            <h3 className="text-[#053B80] text-2xl font-semibold">Participe conosco!</h3>
            <div className="mt-10 w-full sm:w-10/12 flex flex-col gap-4">
              {
                list.map((item, index) => (
                  <HorizontalCard key={index}/>

                ))
              }
            </div>

        </div>
    </div>
  );
}
