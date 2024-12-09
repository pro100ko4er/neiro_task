import UserDtoModel from "src/types/user";

export default class UserDto {
    email;
    id;
    verifyed;
    credits;
    role;
    message;
    constructor(model: UserDtoModel, message: string = '') {
        this.email = model.email
        this.id = model.id
        this.verifyed = model.verifyed,
        this.credits = model.credits
        this.role = model.role
        this.message = message
    }
}