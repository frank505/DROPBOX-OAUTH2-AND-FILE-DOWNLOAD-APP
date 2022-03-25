export type ButtonType = {
    backgroundColor?:string,
    borderColor?:string,
    width?:string,
    height?:number,
    onPress?:(optionalParams?:any) => void,
    disabled?:boolean,
    textString:string,
    testID:string
}

export type ModalActivityIndicatorTypes = {
    visible:boolean,
    size?:number | "large" | "small" | undefined,
    color?:string | undefined,
    textString?:string,
    testID?:string
}
