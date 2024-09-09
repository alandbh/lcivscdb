import Debugg from "@/components/Debugg/Index";
import { FormCompare } from "@/components/form";
import Image from "next/image";

const apiUrl: string | undefined = process.env.BCB_API_URL;

let cdiRate: CdiObject[];

type CdiObject = {
    data: string;
    valor: string;
};

export default async function Home({ params }: { params: any }) {
    if (apiUrl !== undefined) {
        const cdiRateRaw = await fetch(apiUrl, { next: { revalidate: 3600 } });

        cdiRate = await cdiRateRaw.json();
    }
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-indigo-100/60">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-w-[600px]">
                <FormCompare cdiRate={cdiRate[0]} />
            </main>
        </div>
    );
}
