export interface IObject {
    _id: string
    OrganizationGUID: string
    Name: string
    ParentObjectID?:string
    CustomParams?: ICustomParams[]
    FileID?: string
    Polygons?: IPolygon[]
}
export interface IPolygon {
    _id?: string
    coords: number[]
    refIds: string[]
}
export interface ICustomParams {
    _id?: string
    Name: string
    Type: string
    Value: string
}