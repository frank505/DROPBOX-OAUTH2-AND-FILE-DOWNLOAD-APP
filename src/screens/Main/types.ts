
export interface InitApiDataRequest{
path:string,
recursive:boolean,
include_media_info:boolean,
include_deleted:boolean,
include_has_explicit_shared_members:boolean,
include_mounted_folders:boolean,
include_non_downloadable_files:boolean,
limit?:number
}

export interface LoadMoreDataRequest{
    cursor:string
}

export type ImageListType = {
item:any,
downloadSingleFile:any
}