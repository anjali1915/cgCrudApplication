export interface User{
    user_id: number| string| undefined,
    first_name: string,
    last_name: string,
    dob: string| null,
    mobile_number: string,
    address: String,
}

export interface authUserPayload {
    id: number,
    role: string,
}
export interface authUser extends authUserPayload{
    userName: string,
     timestamp: Date
}


export interface adminUser extends authUser{
    password: string,
}
