import { differenceInDays, differenceInBusinessDays } from "date-fns";

type CdiObject = {
    data: string;
    valor: string;
};

type ResponseType = {
    equivalentPercent: number;
    equivalentCdi: number;
    differenceInDays: number;
    irTax: number;
};

export function calculateEquivalence(
    returnType: string,
    cdiPercentage: number,
    fixedRate: number,
    dueDate: Date,
    cdiRate: CdiObject
) {
    let response: ResponseType = {
        equivalentPercent: 0,
        equivalentCdi: 0,
        differenceInDays: 0,
        irTax: 0,
    };

    const yeld = returnType === "cdi" ? cdiPercentage / 100 : fixedRate / 100;

    const cdiRatePercent = Number(cdiRate.valor) / 100; // Current CDI in decimal format
    const deltaBusinessDays = differenceInBusinessDays(dueDate, new Date());
    const deltaFullDays = differenceInDays(dueDate, new Date());
    const deltaYears = deltaBusinessDays / 252; // Near 252 business days in a year

    let yeldLCI_LCA;
    if (returnType === "cdi") {
        yeldLCI_LCA = Math.pow(1 + yeld * cdiRatePercent, deltaYears) - 1;
    } else {
        yeldLCI_LCA = Math.pow(1 + yeld, deltaYears) - 1;
        console.log({ yeld, deltaYears });
    }

    const irTax = getBrazillianIRTax(deltaFullDays);
    const yeldCDBWithoutTax = Math.pow(1 + cdiRatePercent, deltaYears) - 1;
    const yeldCDBWithTax = yeldCDBWithoutTax * (1 - irTax);

    const equivalentYeld =
        ((Math.pow(1 + yeldLCI_LCA, 1 / deltaYears) - 1) /
            (Math.pow(1 + yeldCDBWithTax, 1 / deltaYears) - 1)) *
        cdiRatePercent *
        100;

    response.equivalentPercent = Number(equivalentYeld.toFixed(2));
    response.equivalentCdi = Number(
        (equivalentYeld / cdiRatePercent).toFixed(2)
    );
    response.differenceInDays = deltaFullDays;
    response.irTax = Number((irTax * 100).toFixed(2));

    return response;
}

function getBrazillianIRTax(days: number) {
    if (days <= 180) {
        return 0.225; // 22.5% - investments up to 6 months
    } else if (days <= 360) {
        return 0.2; // 20% - investments up to 1 year
    } else if (days <= 720) {
        return 0.175; // 17,5% - investments up to 2 years
    } else {
        return 0.15; // 15% - investments longer than 2 years
    }
}
