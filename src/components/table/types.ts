import type { ComponentType } from "react";

export type TableProps<T> = {
  data: T[];
  header: ComponentType<{ context: any }>;
  row: ComponentType<{ item: T }>;
  className?: string;
};
