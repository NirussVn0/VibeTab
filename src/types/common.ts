export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type UUID = string;
export type Timestamp = number;
