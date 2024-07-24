import { educationModel } from "../models/education.model";
import { httpApi } from "./http.api";

export interface responseAll {
  message: string;
  statusCode: number;
  data: {
    educations: educationModel[];
  };
  errors: string[];
}

export interface responseDetail {
  message: string;
  statusCode: number;
  data: {
    educations: educationModel;
  };
  errors: string[];
}

export const createEducation = (req: educationModel): Promise<responseAll> =>
  httpApi.post<responseAll>(`educations`, req).then(({ data }) => data);

export const GetEducation = (): Promise<responseAll> =>
  httpApi.get<responseAll>(`educations`).then(({ data }) => data);

export const updateEducation = (
  id: string,
  req: educationModel
): Promise<responseDetail> =>
  httpApi
    .patch<responseDetail>(`educations/${id}`, req)
    .then(({ data }) => data);

export const getEducationDetail = (id: string): Promise<responseDetail> =>
  httpApi.get<responseDetail>(`educations/${id}`).then(({ data }) => data);
