import type { IErrorResponse } from "../types/errors";
import type { IDisciplineNew, IDisciplineRecord, IGetDisciplineResponse, IGetDisciplinesResponse } from "../types/disciplines";
import api, { CREATED, OK, NO_CONTENT } from "./api";

const path = "/disciplines";

export function getDisciplines(): Promise<IGetDisciplinesResponse | IErrorResponse> {
  return api.get<{ data: IDisciplineRecord[] }>(path).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data.data };
    }
    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch(error => ({ success: false as const, errors: [{ msj: error.message }] }));
}

export function getDiscipline(args: { id: string }): Promise<IGetDisciplineResponse | IErrorResponse> {
  return api.get<{ data: IDisciplineRecord }>(`${path}/${args.id}`).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data.data };
    }
    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch(error => ({ success: false as const, errors: [{ msj: error.message }] }));
}

export function postDiscipline(args: { data: { discipline: IDisciplineNew } }): Promise<IGetDisciplineResponse | IErrorResponse> {
  return api.post<IDisciplineRecord>(path, args.data).then(response => {
    if (response.status === CREATED) {
      return { success: true as const, data: response.data };
    }
    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch(error => ({ success: false as const, errors: [{ msj: error.message }] }));
}

export function putDiscipline(args: { id: string; data: { discipline: IDisciplineNew } }): Promise<IGetDisciplineResponse | IErrorResponse> {
  return api.put<IDisciplineRecord>(`${path}/${args.id}`, args.data).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data };
    }
    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch(error => ({ success: false as const, errors: [{ msj: error.message }] }));
}

export function deleteDiscipline(args: { id: number }): Promise<{ success: true } | IErrorResponse> {
  return api.delete(`${path}/${args.id}`).then(response => {
    if (response.status === OK || response.status === NO_CONTENT) return { success: true as const };
    return { success: false as const, errors: [{ msj: response.status.toString() }] };
  }).catch(error => ({ success: false as const, errors: [{ msj: error.message }] }));
}
