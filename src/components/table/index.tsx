import dynamic from "next/dynamic";

import clsx from "clsx";

import style from "./table.module.css";
import type { TableProps } from "./types";

const LargeTable = dynamic(() => import("./table-virtual"), { ssr: false });

function SmallTable<T>({ data, header: Header, row: Row, className }: TableProps<T>) {
  return (
    <div className={style.outerContainer}>
      <div className={clsx(style.innerContainer, "w-min")}>
        <div className={clsx(style.scroller, "w-min", className)}>
          <div className="w-min">
            <div>
              <Header context />
            </div>
            <div className={style.list}>
              {data.map((item, i) => (
                <div key={i} className={style.item}>
                  <Row item={item} />
                </div>
              ))}
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Table<T>(props: TableProps<T>) {
  return props.data.length >= 30 ? (
    <LargeTable {...(props as TableProps<any>)} />
  ) : (
    <SmallTable<T> {...props} />
  );
}
