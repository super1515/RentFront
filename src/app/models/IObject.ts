export interface IObject {
    _id: string
    OrganizationGUID: string
    Name: string
    ParentObjectID?:string
    CustomParams?: ICustomParams[]
}

export interface ICustomParams {
    Name: string
    Type: string
    Value: string
}