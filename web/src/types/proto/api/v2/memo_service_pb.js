// @generated by protoc-gen-es v1.3.0
// @generated from file api/v2/memo_service.proto (package memos.api.v2, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";
import { RowStatus } from "./common_pb.js";

/**
 * @generated from enum memos.api.v2.Visibility
 */
export const Visibility = proto3.makeEnum(
  "memos.api.v2.Visibility",
  [
    {no: 0, name: "VISIBILITY_UNSPECIFIED"},
    {no: 1, name: "PRIVATE"},
    {no: 2, name: "PROTECTED"},
    {no: 3, name: "PUBLIC"},
  ],
);

/**
 * @generated from message memos.api.v2.Memo
 */
export const Memo = proto3.makeMessageType(
  "memos.api.v2.Memo",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "row_status", kind: "enum", T: proto3.getEnumType(RowStatus) },
    { no: 3, name: "creator_id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "created_ts", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 5, name: "updated_ts", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 6, name: "content", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "visibility", kind: "enum", T: proto3.getEnumType(Visibility) },
    { no: 8, name: "pinned", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * @generated from message memos.api.v2.ListMemosRequest
 */
export const ListMemosRequest = proto3.makeMessageType(
  "memos.api.v2.ListMemosRequest",
  () => [
    { no: 1, name: "page", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "page_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "filter", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message memos.api.v2.ListMemosResponse
 */
export const ListMemosResponse = proto3.makeMessageType(
  "memos.api.v2.ListMemosResponse",
  () => [
    { no: 1, name: "memos", kind: "message", T: Memo, repeated: true },
  ],
);

/**
 * @generated from message memos.api.v2.GetMemoRequest
 */
export const GetMemoRequest = proto3.makeMessageType(
  "memos.api.v2.GetMemoRequest",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ],
);

/**
 * @generated from message memos.api.v2.GetMemoResponse
 */
export const GetMemoResponse = proto3.makeMessageType(
  "memos.api.v2.GetMemoResponse",
  () => [
    { no: 1, name: "memo", kind: "message", T: Memo },
  ],
);

