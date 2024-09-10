import { FormCompare } from "@/components/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const apiUrl: string | undefined = process.env.BCB_API_URL;

let cdiRate: CdiObject[];

let apiError: boolean = false;

type CdiObject = {
    data: string;
    valor: string;
};

export default async function Home() {
    if (apiUrl !== undefined) {
        fetch(apiUrl, {
            next: { revalidate: 86400 },
        })
            .then((response) => response.json())

            .then((cdiRaw) => {
                cdiRate = cdiRaw;
                console.log("CdiRate", cdiRate);
                console.log("apiError", apiError);
            })
            .catch((error) => {
                apiError = true;
                console.error("DEU ERRO", apiError);
                console.error("falha na API", error);
            });

        // cdiRate = await cdiRateRaw.json();
    }

    if (cdiRate !== undefined) {
        return (
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-indigo-100/60">
                <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start md:min-w-[600px]">
                    <FormCompare cdiRate={cdiRate[0]} />
                </main>
            </div>
        );
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-indigo-100/60">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start md:min-w-[600px]">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>
                        Falha na conexão com o Banco Central. <br />
                        Recarregue a página e tente novamente.
                    </AlertDescription>
                </Alert>
            </main>
        </div>
    );
}
