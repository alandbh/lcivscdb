import {  differenceInDays, differenceInBusinessDays } from "date-fns";


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
}

export function calcularEquivalencia(returnType: string, cdiPercentage:number, fixedRate: number, dueDate:Date, cdiRate:CdiObject ) {

let response: ResponseType = {
    message: "",
    equivalentPercent: 0,
    equivalentCdi: 0,
    differenceInDays: 0,
    irTax: 0
};


  const rendimento = returnType === "cdi" ? cdiPercentage/100 : fixedRate / 100;
  const vencimento = new Date(dueDate);

//   if (isNaN(rendimento) || !vencimento) {
//     resultadoDiv.textContent =
//       "Por favor, preencha todos os campos corretamente.";
//     return;
//   }

  const cdiAtual = Number(cdiRate.valor) / 100; // CDI atual em decimal
  const diasUteis = calcularDiasUteis(new Date(), vencimento);
  const diasCorridos = calcularDiasCorridos(new Date(), vencimento);
  const anos = diasUteis / 252; // Aproximadamente 252 dias úteis por ano

  let rendimentoLCI_LCA;
  if (returnType === "cdi") {
    rendimentoLCI_LCA = Math.pow(1 + rendimento * cdiAtual, anos) - 1;
    
} else {
    rendimentoLCI_LCA = Math.pow(1 + rendimento, anos) - 1;
    console.log({rendimento, anos});
  }

  const imposto = calcularImpostoRenda(diasCorridos);
  const rendimentoCDBBruto = Math.pow(1 + cdiAtual, anos) - 1;
  const rendimentoCDBLiquido = rendimentoCDBBruto * (1 - imposto);

  const rendimentoEquivalente =
    ((Math.pow(1 + rendimentoLCI_LCA, 1 / anos) - 1) /
      (Math.pow(1 + rendimentoCDBLiquido, 1 / anos) - 1)) *
    cdiAtual *
    100;

  response.message = `Esse LCI/LCA equivale a um CDB com rendimento de ${rendimentoEquivalente.toFixed(
    2
  )}% ao ano. Ou ${(rendimentoEquivalente / cdiAtual).toFixed(2)}% do CDI. Dias corridos: ${diasCorridos}. IR: ${imposto}`;

  response.equivalentPercent = Number(rendimentoEquivalente.toFixed(2))
  response.equivalentCdi = Number((rendimentoEquivalente / cdiAtual).toFixed(2))
  response.differenceInDays = diasCorridos
  response.irTax = Number((imposto * 100).toFixed(2))

  return response;
}

function calcularDiasUteis(inicio:Date, fim:Date) {
//   let count = 0;
//   const date = new Date(inicio);
//   while (date <= fim) {
//     const day = date.getDay();
//     if (day !== 0 && day !== 6) {
//       // Exclui sábado e domingo
//       count++;
//     }
//     date.setDate(date.getDate() + 1);
//   }
  return differenceInBusinessDays(fim, inicio);
}

function calcularDiasCorridos(inicio:Date, fim:Date) {
  
//   // Calcula a diferença em milissegundos
//   const diffEmMilissegundos = Math.abs(fim - inicio);

//   // Converte milissegundos para dias
//   const diasEmMilissegundos = 1000 * 60 * 60 * 24;
//   const diasEntreDatas = Math.ceil(diffEmMilissegundos / diasEmMilissegundos);

const diasEntreDatas = differenceInDays(fim, inicio);
  
  return diasEntreDatas ;
  
}

function calcularImpostoRendaAnos(anos:number) {
  if (anos < 1) {
    return 0.22; // 22% para até 1 ano
  } else if (anos < 2) {
    alert("1 ano");
    return 0.2; // 20% para até 2 anos
  } else {
    return 0.15; // 15% para mais de 2 anos
  }
}

function calcularImpostoRenda(dias:number) {
  if (dias <= 180) {
    return 0.225; // 22.5% para até 6 meses
  } else if (dias <= 360) {
    alert("1 ano");
    return 0.2; // 20% para até 1 anos
  } else if (dias <= 720) {
    return 0.175 // 17,5% para até 2 anos
  } else {
    return 0.15; // 15% para mais de 2 anos
  }
}