import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";
import { Button } from "./button";

// import { Container } from './styles';

type ResponseType = {
    equivalentPercent: number;
    equivalentCdi: number;
    differenceInDays: number;
    irTax: number;
};
function CustomCta({
    handleCalculateClick,
    isDisable,
    response,
    cdiRate,
}: {
    handleCalculateClick: () => void;
    isDisable: boolean;
    response: ResponseType | null;
    cdiRate: { valor: string; data: string } | undefined;
}) {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button onClick={handleCalculateClick} disabled={isDisable}>
                        Calcular Equivalência →
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[420px] max-sm:max-w-[calc(100%-40px)] md:min-w-[640px] bg-indigo-900 text-slate-300 border-indigo-500">
                    <DialogHeader>
                        <DialogTitle>Resultado</DialogTitle>
                        <div className="py-10 flex flex-col gap-5 text-lg">
                            <p>
                                Esse LCI/LCA equivale a um CDB com rendimento de{" "}
                                <b className="underline">
                                    {response?.equivalentPercent}
                                </b>
                                % ao ano. <br />
                                Ou{" "}
                                <b className="underline">
                                    {response?.equivalentCdi}
                                </b>
                                % do CDI.
                            </p>
                            <div className=" mt-10 text-sm flex flex-col gap-2">
                                <p>
                                    Dias corridos: {response?.differenceInDays}.
                                </p>
                                <p>Imposto de renda: {response?.irTax}%</p>
                                <p>
                                    Taxa do CDI: {cdiRate?.valor}
                                    %. <br />
                                    <small>
                                        Última atualização pelo Banco Central:{" "}
                                        {cdiRate?.data}
                                    </small>{" "}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CustomCta;
