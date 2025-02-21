import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export type TableProps<T> = {
  data: T[];
  header: ComponentType<{ context?: never }>;
  row: ComponentType<{ item: T }>;
  className?: string;
};

const TableVirtual = dynamic(() => import("./table-virtual"), { ssr: false });

export function Table<T>(props: TableProps<T>) {
  return <TableVirtual {...(props as TableProps<any>)} />;
}
