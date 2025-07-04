import type { IAlumnGuardiansRecord, IAlumnNew, IAlumnRecord, IGetAlumnGuardiansResponse, IGetAlumnsResponse, IPostAlumnResponse } from "../types/alumns";
import type { IErrorResponse } from "../types/errors";
import api, { CREATED, OK } from "./api";

const path = "/alumns";

export function getAlumns(args: { params?: string }): Promise<IGetAlumnsResponse | IErrorResponse> {
  return api.get<IGetAlumnsResponse>(`${path}?${args.params}`).then(response => {
    if (response.status === OK) {
      const { data, links, pages } = response.data
      return { success: true as const, data, links, pages };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function getAlumn(args: { id: string }): Promise<IGetAlumnGuardiansResponse | IErrorResponse> {
  return api.get<IAlumnGuardiansRecord>(`${path}/${args.id}`).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function postAlumn(args: { data: IAlumnNew }): Promise<IPostAlumnResponse | IErrorResponse> {
  return api.post<IAlumnRecord>(path, args.data).then(response => {
    if (response.status === CREATED) {
      return {
        success: true as const,
        data: response.data
      };
    } else {
      return {
        success: false as const,
        errors: [{ msj: response.status.toString() }]
      };
    }
  }).catch((error: { message: string }) => {
    return {
      success: false as const,
      errors: [{ msj: error.message }]
    };
  });
}

export function putAlumn(args: { id: string, data: IAlumnNew }): Promise<IPostAlumnResponse | IErrorResponse> {
  return api.put<IAlumnRecord>(`${path}/${args.id}`, args.data).then(response => {
    if (response.status === OK) {
      return {
        success: true as const,
        data: response.data
      };
    } else {
      return {
        success: false as const,
        errors: [{ msj: response.status.toString() }]
      };
    }
  }).catch((error: { message: string }) => {
    return {
      success: false as const,
      errors: [{ msj: error.message }]
    };
  });
}