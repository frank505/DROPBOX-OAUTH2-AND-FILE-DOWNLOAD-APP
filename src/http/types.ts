import { Method } from "axios"
import { SetStateAction } from "react"
import { Alert } from "react-native"

export type PostRequestType = {
    method:string|Method|any,
    body:any,
    addedUrl:string,
    contentType?:string,
    setResponseData?:SetStateAction<any>,
    setIsLoading?: SetStateAction<any>
}