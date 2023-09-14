// @generated by protoc-gen-es v1.3.0
// @generated from file store/user_setting.proto (package memos.store, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * @generated from enum memos.store.UserSettingKey
 */
export const UserSettingKey = proto3.makeEnum(
  "memos.store.UserSettingKey",
  [
    {no: 0, name: "USER_SETTING_KEY_UNSPECIFIED"},
    {no: 1, name: "USER_SETTING_ACCESS_TOKENS"},
  ],
);

/**
 * @generated from message memos.store.UserSetting
 */
export const UserSetting = proto3.makeMessageType(
  "memos.store.UserSetting",
  () => [
    { no: 1, name: "user_id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "key", kind: "enum", T: proto3.getEnumType(UserSettingKey) },
    { no: 3, name: "access_tokens", kind: "message", T: AccessTokensUserSetting, oneof: "value" },
  ],
);

/**
 * @generated from message memos.store.AccessTokensUserSetting
 */
export const AccessTokensUserSetting = proto3.makeMessageType(
  "memos.store.AccessTokensUserSetting",
  () => [
    { no: 1, name: "access_tokens", kind: "message", T: AccessTokensUserSetting_AccessToken, repeated: true },
  ],
);

/**
 * @generated from message memos.store.AccessTokensUserSetting.AccessToken
 */
export const AccessTokensUserSetting_AccessToken = proto3.makeMessageType(
  "memos.store.AccessTokensUserSetting.AccessToken",
  () => [
    { no: 1, name: "access_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
  {localName: "AccessTokensUserSetting_AccessToken"},
);

