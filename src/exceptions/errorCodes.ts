import { baseError } from "./types"

export const INVALID_DATA:baseError = {
    errorCode:"INVALID_DATA",
    errorDescription:"Há campos inválidos na requisição",
    status:400
}

export const MEASURE_NOT_FOUND:baseError = {
    errorCode:"MEASURE(S)_NOT_FOUND",
    errorDescription:"Nenhuma leitura encontrada",
    status:404
}

export const CUSTOMER_NOT_FOUND:baseError = {
    errorCode:"CUSTOMER_NOT_FOUND",
    errorDescription:"Nenhum cliente encontrado",
    status:404
}

export const CONFIRMATION_DUPLICATE:baseError = {
    errorCode:"CONFIRMATION_DUPLICATE",
    errorDescription:"Leitura do mês já realizada",
    status:409
}

export const INVALID_TYPE:baseError = {
    errorCode:"INVALID_TYPE",
    errorDescription:"Tipo de medição não permitida",
    status:400
}

export const DOUBLE_REPORT:baseError = {
    errorCode:"DOUBLE_REPORT",
    errorDescription:"Leitura do mês já realizada",
    status:409
}

export const AI_ERROR:baseError = {
    errorCode:"AI_ERROR",
    errorDescription:"Erro com o servidor da AI",
    status:421
}