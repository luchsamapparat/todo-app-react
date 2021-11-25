import { lastElement } from "./array";
import { lowerFirst } from "./string";

export interface Violation {
    field: string;
    message: string;
}

export class ValidationError extends Error {
    constructor(
        public readonly violations: Violation[]
    ) {
        super('ValidationError');
    }
}

export function getInvalidFormControlCssClass(violations: Violation[] | undefined) {
    if (violations === undefined) {
        return '';
    }

    return (violations.length > 0) ? 'is-invalid' : 'is-valid';
}

export const toViolations = (responseBody: any): Violation[] => {
    if (responseBody.errors !== undefined) {
        return fromErrors(responseBody);
    }

    if (responseBody.violations !== undefined) {
        return responseBody.violations;
    }

    throw new Error('Cannot parse response body.');
};

const fromErrors = (responseBody: any): Violation[] => Object
    .keys(responseBody.errors)
    .map(field => {
        const messages: string[] = responseBody.errors[field];
        return {
            field: lowerFirst(field),
            message: lastElement(messages)
        };
    });;