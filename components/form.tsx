"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Datepicker } from "./ui/Datepicker";
import { useEffect, useState } from "react";
import Debugg from "./Debugg/Index";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { differenceInDays } from "date-fns";

import { calcularEquivalencia } from "@/lib/calculate";

import CustomCta from "./ui/CustonCta";

type CdiObject = {
    data: string;
    valor: string;
};

type ResponseType = {
    message: string;
    equivalentPercent: number;
    equivalentCdi: number;
    differenceInDays: number;
    irTax: number;
};

export function FormCompare({ cdiRate }: { cdiRate: CdiObject }) {
    const [dueDate, setDueDate] = useState<Date>();
    const [returnType, setReturnType] = useState<string>("cdi");
    const [cdiPercentage, setCdiPercentage] = useState<number[]>([100]);
    const [fixedRate, setFixedRate] = useState<number[]>([6]);
    const [isDisable, setIsDisable] = useState<boolean>(true);
    const [response, setResponse] = useState<ResponseType | null>(null);

    function handleSelectDate(date: Date) {
        console.log("dataa: ", new Date(date).getTime());

        setDueDate(date);
    }

    function handleReturnTypeChange(value: string) {
        console.log("eee", value);
        setReturnType(value);
        // setIsDisable(true);
    }

    function handleCdiPercentageChange(value: number[]) {
        console.log("cdi", value);
        setCdiPercentage(value);
    }

    function handleFixedRateChange(value: number[]) {
        setFixedRate(value);
        console.log("fixo", fixedRate);
    }

    function handleCalculateClick() {
        if (dueDate) {
            const response = calcularEquivalencia(
                returnType,
                Number(cdiPercentage[0]),
                fixedRate[0],
                dueDate,
                cdiRate
            );
            console.log({ response });

            setResponse(response);
        }
    }

    useEffect(() => {
        if (returnType === "cdi") {
            if (
                cdiPercentage[0] > 80 &&
                dueDate &&
                differenceInDays(dueDate.getTime(), new Date().getTime()) > 30
            ) {
                setIsDisable(false);
            } else {
                setIsDisable(true);
            }
        } else {
            if (
                fixedRate[0] > 6 &&
                dueDate &&
                differenceInDays(dueDate.getTime(), new Date().getTime()) > 30
            ) {
                setIsDisable(false);
            } else {
                setIsDisable(true);
            }
        }
    }, [cdiPercentage, dueDate, fixedRate, returnType]);

    return (
        <>
            <Card className="w-full md:max-w-2xl">
                <Debugg data={cdiRate} filter="cdii" />
                <CardHeader className="border-b mb-10">
                    <CardTitle className="leading-relaxed">
                        Equivalência{" "}
                        <span className="max-sm:whitespace-nowrap">
                            LCI/LCA vs CDB
                        </span>
                    </CardTitle>
                    <CardDescription>
                        Preencha os dados da sua LCI/LCA.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4  grid-rows-[80px_80px] max-sm:flex max-sm:flex-col max-sm:gap-10 max-sm:-mt-5">
                    <div className="grid grid-cols-4 gap-4 max-sm:flex max-sm:flex-col max-sm:gap-10">
                        <div className="col-span-2">
                            <Label className="font-bold" htmlFor="income-type">
                                Tipo de Rendimento:
                            </Label>
                            <RadioGroup
                                defaultValue={returnType}
                                className="flex gap-5 mt-3"
                                onValueChange={(value) =>
                                    handleReturnTypeChange(value)
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="prefixed"
                                        id="prefixed"
                                    />
                                    <Label htmlFor="prefixed">Pré-fixado</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cdi" id="cdi" />
                                    <Label htmlFor="cdi">CDI</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {returnType === "prefixed" ? (
                            <div className="space-y-2 col-span-2">
                                <Label
                                    className="font-bold"
                                    htmlFor="income-amount"
                                >
                                    Rendimento:{" "}
                                    <span className="text-indigo-500">
                                        {fixedRate[0]}%
                                    </span>{" "}
                                    a.a
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Slider
                                        defaultValue={[6]}
                                        value={fixedRate}
                                        min={0}
                                        max={20}
                                        step={0.1}
                                        onValueChange={(value) =>
                                            handleFixedRateChange(value)
                                        }
                                        className="h-5"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 col-span-2">
                                <Label
                                    className="font-bold"
                                    htmlFor="income-amount"
                                >
                                    <span className="text-indigo-500">
                                        {cdiPercentage[0]}%
                                    </span>{" "}
                                    do CDI:
                                </Label>
                                <Slider
                                    defaultValue={[100]}
                                    value={cdiPercentage}
                                    min={0}
                                    max={200}
                                    onValueChange={(value) =>
                                        handleCdiPercentageChange(value)
                                    }
                                    className="h-5"
                                />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 grid-cols-2 grid gap-5 max-sm:flex max-sm:flex-col">
                        <div className="flex flex-col justify-end">
                            <Label
                                className="font-bold mb-4"
                                htmlFor="vencimento"
                            >
                                Data de Vencimento:
                            </Label>

                            <div>
                                <Datepicker
                                    className="w-full"
                                    onSelectDate={handleSelectDate}
                                />
                            </div>
                            <div>{/* <Debugg print data={dueDate} /> */}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <CustomCta
                                handleCalculateClick={handleCalculateClick}
                                response={response}
                                cdiRate={cdiRate}
                                isDisable={isDisable}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
