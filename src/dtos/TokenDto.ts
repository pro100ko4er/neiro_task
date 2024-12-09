import { TokenDtoModel } from "src/types/token";

export default class TokenDto {
    refreshToken;
    accessToken;
    deviceId;
    constructor(model: TokenDtoModel, accessToken = '') {
        this.accessToken = accessToken
        this.refreshToken = model.refreshToken
        this.deviceId = model.deviceId
    }
}