import { FetchMethods } from "@/types/types";
import { toast } from "react-toastify";

export const addThousandSeparators = (number: Number | undefined, currency = '') => {
    if(number !== undefined) {
        const suffix = currency ? ` ${currency}` : ''
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + suffix;
    }
    return number
  };

export const parseFinancialInput = (input: string | number | undefined) => {
    if(input) {
        if(typeof(input) === 'string') {
            let parsedInput = 0;
            const numbers = input.split(' ').join('').split('+');
            numbers.forEach((number) => {
                parsedInput += parseInt(number);
            });
            return parsedInput;
        }
    }
    return input;
};

export const showSuccessToast = (parameters: {subject: string, fetchMethod?: FetchMethods, customMessage?: string}) => {
    const action = 
        parameters.fetchMethod === FetchMethods.post ? 'has been added' : 
        parameters.fetchMethod === FetchMethods.put ? 'has been updated' : 
        parameters.fetchMethod === FetchMethods.delete ? 'has been deleted' : 
        parameters.customMessage

    toast.success(`${parameters.subject} ${action}`, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        });
}

export const showWarningToast = (message: string) => {
    toast.warning(message, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        });
}