import { FileDto } from "./file.type";

export type UserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  position_id: number;
  registration_timestamp: number;
  photo: string;
}

export type GetUserQueryParams = {
  page?: number;
  offset?: number;
  count?: number;
}

export type CreateUserDto = {
  name: string;
  email: string;
  phone: string;
  position_id: number;
  photoFile: FileDto;
}