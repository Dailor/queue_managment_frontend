interface IErrorsRecords {
    [key: string]: string
}

interface IDetailAPI {
    loc: string[],
    msg: string,
    type: string
}

export interface IErrorAPI {
    detail: IDetailAPI[]
}

export const errorsApiToObject = (errorsAPI: IErrorAPI) => {
    const errors: IErrorsRecords = {}

    errorsAPI.detail.forEach((detail) => {
        errors[detail.loc.slice(-1)[0]] = detail.msg
    })

    return errors
}