import Debugg from "@/components/Debugg/Index";
import { FormCompare } from "@/components/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const apiUrl: string | undefined = process.env.BCB_API_URL;

let cdiRate: CdiObject[];

let apiError: boolean = false;
let apiErrorMessage: unknown;

type CdiObject = {
    data: string;
    valor: string;
};

export default async function Home() {
    if (apiUrl !== undefined) {
        // fetch(apiUrl, {
        //     next: { revalidate: 86400 },
        // })
        //     .then((response) => response.json())

        //     .then((cdiRaw) => {
        //         cdiRate = cdiRaw;
        //         console.log("CdiRate", cdiRate);
        //         console.log("apiError", apiError);
        //     })
        //     .catch((error) => {
        //         apiError = true;
        //         apiErrorMessage = error;
        //         console.error("DEU ERRO", apiError);
        //         console.error("falha na API", error);
        //     });

        try {
            const cdiRateRaw = await fetch(apiUrl, {
                next: { revalidate: 86400 },
            });

            cdiRate = await cdiRateRaw.json();
        } catch (error) {
            apiError = true;
            apiErrorMessage = error;
            console.error("DEU ERRO", apiError);
            console.error("falha na API", error);
        }
    }

    if (!cdiRate || typeof cdiRate !== "object" || apiError) {
        return (
            <div className="md:grid md:grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen max-sm:p-4 md:pb-20 md:gap-16 md:p-20 font-[family-name:var(--font-geist-sans)] bg-indigo-100/60">
                <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start md:min-w-[600px]">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>
                            Falha na conexão com o Banco Central. <br />
                            Recarregue a página e tente novamente.
                        </AlertDescription>
                    </Alert>

                    {/* <Debugg data={apiErrorMessage} print={true} /> */}

                    {/* <Debugg
                        data={cdiRate}
                        filter="erro CDIRate: "
                        print={true}
                    ></Debugg> */}
                </main>
            </div>
        );
    }

    return (
        <div className="md:grid md:grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 max-sm:p-4 pb-20 md:gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-indigo-100/60">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start md:min-w-[600px]">
                <FormCompare cdiRate={cdiRate[0]} />
            </main>
        </div>
    );
}
