import type { ILinks } from "./common"

export interface IProductRecord {
  id: number
  name: string
  price: number
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IProductNew {
  name: string
  price: string
  description: string
}

export interface IGetProductResponse {
  data: IProductRecord
  success: true,
}

export interface IGetProductsResponse {
  data: IProductRecord[]
  links: ILinks,
  pages: number[]
  success: true,
}

