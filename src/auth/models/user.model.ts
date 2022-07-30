export interface BaseUser {
    email: string,
    password: string,
}

export interface UserModel extends BaseUser {
    name: string, 
    isAdmin: boolean,
}