// Generated by Xata Codegen 0.29.3. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "File",
    columns: [
      { name: "file", type: "file" },
      { name: "name", type: "string", unique: true },
    ],
  },
  {
    name: "Like",
    columns: [
      { name: "likeCount", type: "int" },
      {
        name: "likedEntity",
        type: "link",
        link: { table: "Entity" },
        unique: true,
      },
    ],
    revLinks: [{ column: "like", table: "Entity" }],
  },
  {
    name: "Entity",
    columns: [
      { name: "like", type: "link", link: { table: "Like" }, unique: true },
    ],
    revLinks: [
      { column: "entity", table: "NodeLike" },
      { column: "likedEntity", table: "Like" },
    ],
  },
  {
    name: "Node",
    columns: [{ name: "snapshot", type: "link", link: { table: "Snapshot" } }],
    revLinks: [{ column: "node", table: "NodeLike" }],
  },
  {
    name: "NodeLike",
    columns: [
      { name: "node", type: "link", link: { table: "Node" } },
      { name: "content", type: "string" },
      { name: "entity", type: "link", link: { table: "Entity" }, unique: true },
    ],
  },
  {
    name: "Snapshot",
    columns: [
      { name: "document", type: "json" },
      { name: "name", type: "string", notNull: true, defaultValue: "snapshot" },
    ],
    revLinks: [{ column: "snapshot", table: "Node" }],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type File = InferredTypes["File"];
export type FileRecord = File & XataRecord;

export type Like = InferredTypes["Like"];
export type LikeRecord = Like & XataRecord;

export type Entity = InferredTypes["Entity"];
export type EntityRecord = Entity & XataRecord;

export type Node = InferredTypes["Node"];
export type NodeRecord = Node & XataRecord;

export type NodeLike = InferredTypes["NodeLike"];
export type NodeLikeRecord = NodeLike & XataRecord;

export type Snapshot = InferredTypes["Snapshot"];
export type SnapshotRecord = Snapshot & XataRecord;

export type DatabaseSchema = {
  File: FileRecord;
  Like: LikeRecord;
  Entity: EntityRecord;
  Node: NodeRecord;
  NodeLike: NodeLikeRecord;
  Snapshot: SnapshotRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Iv-n-Ruiz-G-zquez-s-workspace-0ntic2.eu-west-1.xata.sh/db/ivanruiz",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};