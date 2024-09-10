"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Datepicker } from "./ui/Datepicker";
import { useEffect, useState } from "react";
import Debugg from "./Debugg/Index";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { differenceInDays } from "date-fns";

import { calcularEquivalencia } from "@/lib/calculate";

type CdiObject = {
    data: string;
    valor: string;
};

export function FormCompare({ cdiRate }: { cdiRate: CdiObject }) {
    const [dueDate, setDueDate] = useState<Date>();
    const [returnType, setReturnType] = useState<string>("cdi");
    const [cdiPercentage, setCdiPercentage] = useState<number[]>([100]);
    const [fixedRate, setFixedRate] = useState<number>(6);
    const [isDisable, setIsDisable] = useState<boolean>(true);

    function handleSelectDate(date: Date) {
        console.log("dataa: ", new Date(date).getTime());

        setDueDate(date);
    }

    function handleReturnTypeChange(value: string) {
        console.log("eee", value);
        setReturnType(value);
        setIsDisable(true);
    }

    function handleCdiPercentageChange(value: number[]) {
        console.log("cdi", value);
        setCdiPercentage(value);
    }

    function handleFixedRateChange(value: string) {
        setFixedRate(Number(value));
        console.log("fixo", fixedRate);
    }

    function handleCalculateClick() {
        if (dueDate) {
            calcularEquivalencia(returnType, fixedRate, dueDate, cdiRate);
        }
    }

    useEffect(() => {
        if (returnType === "cdi") {
            if (
                cdiPercentage[0] > 50 &&
                dueDate &&
                differenceInDays(dueDate.getTime(), new Date().getTime()) > 30
            ) {
                setIsDisable(false);
            } else {
                setIsDisable(true);
            }
        } else {
            if (
                fixedRate > 6 &&
                dueDate &&
                differenceInDays(dueDate.getTime(), new Date().getTime()) > 30
            ) {
                setIsDisable(false);
            } else {
                setIsDisable(true);
            }
        }
    }, [cdiPercentage, dueDate, fixedRate]);

    return (
        <>
            <Card className="w-full max-w-2xl">
                <Debugg data={cdiRate} filter="cdii" />
                <CardHeader className="border-b mb-10">
                    <CardTitle>Equivalência LCI/LCA vs CDB</CardTitle>
                    <CardDescription>
                        Preencha os dados da sua LCI/LCA.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4  grid-rows-[80px_80px]">
                    <div className="grid grid-cols-4 gap-4">
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
                                    Rendimento ao ano:
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="income-amount"
                                        type="number"
                                        placeholder="Ex: 11,3%"
                                        className="w-28"
                                        step="0.1"
                                        value={fixedRate}
                                        onChange={(event) =>
                                            handleFixedRateChange(
                                                (
                                                    event.target as HTMLInputElement
                                                ).value
                                            )
                                        }
                                    />
                                    <small className="text-xs text-pretty text-gray-400">
                                        a/a
                                    </small>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 col-span-2">
                                <Label
                                    className="font-bold"
                                    htmlFor="income-amount"
                                >
                                    {cdiPercentage[0]}% do CDI:
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
                                {/* <small className="text-xs text-pretty text-gray-400">
                                    {cdiPercentage}% do CDI
                                </small> */}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 grid-cols-2 grid gap-5">
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
                            <Button disabled={isDisable} type="submit">
                                Calcular Equivalência →
                            </Button>
                        </div>
                    </div>
                </CardContent>

                {/* <CardFooter className="flex justify-end">
                    <Button type="submit">Calcular Equivalência</Button>
                </CardFooter> */}

                {/* <hr />

                <CardHeader>
                    <CardTitle>Resultado</CardTitle>
                    <CardDescription>
                        Esta LCI/LCA equivale a um CDB de 12% ao ano ou 130% do
                        CDI.
                    </CardDescription>
                </CardHeader> */}
            </Card>
            <div
                id="alert-additional-content-1"
                className="ring-4 max-w-2xl p-4 mb-4 text-indigo-800 border border-indigo-300 rounded-lg bg-indigo-50"
                role="alert"
            >
                <div className="flex items-center">
                    <svg
                        className="flex-shrink-0 w-4 h-4 me-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <h3 className="text-lg font-medium">
                        This is a info alert
                    </h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                    More info about this info alert goes here. This example text
                    is going to run a bit longer so that you can see how spacing
                    within an alert works with this kind of content.
                </div>
            </div>
        </>
    );
}
