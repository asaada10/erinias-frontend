export interface TokenPayload {
  userId: string;
  deviceId?: string;
  iss?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export enum PermissionFlags {
  SendMessages = 1 << 0,
  ViewChannels = 1 << 1,
  ManageMessages = 1 << 2,
  ManageChannels = 1 << 3,
  ManageRoles = 1 << 4,
  KickMembers = 1 << 5,
  BanMembers = 1 << 6,
  ManageGuild = 1 << 7,
}
