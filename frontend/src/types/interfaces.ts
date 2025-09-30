export interface User {
    firstName: string,
    lastName: string,
    dob: string,
    mobileNumber: string,
    address: string
}

export interface loginUser {
    userName: string,
    password: string;
}

export interface UserTableDataMount {
   user_id: number;
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

export interface UserTableData extends UserTableDataMount{
  total_count?: number;
}

export interface ApiResponse<T>{
  success: boolean;
  data: T;
  message: string;
}

export type UserResponse = {
  users: UserTableData[];
};

export interface searchParams{
  search?:string;
  page:number;
  limit:number;
  sortBy:string;
  direction:string;
}

export interface authUserPayload {
    id: number,
    role: string,
}