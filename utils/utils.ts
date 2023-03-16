import { FetchMethods } from "@/types/types";
import { toast } from "react-toastify";

export const addThousandSeparators = (number: Number | undefined, currency = '') => {
    if(number !== undefined) {
        const suffix = currency ? ` ${currency}` : ''
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + suffix;
    }
    return ''
  };

export const formatInput = (target: EventTarget) => {
    const input = target as HTMLInputElement;
    const individualValues = input.value.split('+')
    const parsedIndividualValues = individualValues.map((individualValue) => individualValue.split(' ').join(''))
    let returnValue = '';
    parsedIndividualValues.forEach((value, id, array) => {
        if (!isNaN(parseInt(value))) returnValue += addThousandSeparators(parseInt(value));
        if (id !== array.length - 1) returnValue += '+';
    })
    if (!isNaN(parseInt(returnValue))) input.value = returnValue
}

export const replaceEmptyValue = (target: EventTarget, replaceWith = 0) => {
    const input = target as HTMLInputElement;
    if (input.value === '' || input.value === null || input.value === undefined) {
        input.focus();
        document.execCommand('insertText', false, '0');
        input.blur();
    } else {
        return
    }
}

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

export const showErrorToast = () => {
    toast.error('Oops! An error occurred', {
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

export const formatDate = (date: Date) => {
    date = new Date(date)
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

    const hour = (date.getHours() < 10 ? '0' : '') + date.getHours()
    const minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()

    return `${year} ${month} ${day}, ${hour}:${minute}`
}