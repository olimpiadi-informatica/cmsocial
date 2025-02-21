import { Fragment, forwardRef, useLayoutEffect, useRef, useState } from "react";

import clsx from "clsx";
import { type Components, Virtuoso } from "react-virtuoso";

import type { TableProps } from "~/components/table";

import style from "./table.module.css";

export default function TableVirtual<T>({
  data,
  header: Header,
  row: Row,
  className,
}: TableProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const viewport = entries[0];
      setWidth(viewport.target.scrollWidth + 2);
    });

    const viewport = ref.current?.children[0].children[0];
    if (viewport) obs.observe(viewport);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={style.outerContainer}>
      <div className={style.innerContainer} ref={ref} style={{ width }}>
        <Virtuoso<T>
          data={data}
          itemContent={(_index, item) => <Row item={item} />}
          components={{ Header, Footer, List, Item }}
          increaseViewportBy={200}
          className={clsx(style.scroller, className)}
          useWindowScroll
        />
      </div>
    </div>
  );
}

const List: Components["List"] = forwardRef(({ context: _context, ...props }, ref) => {
  return <div ref={ref} {...props} className={style.list} />;
});

const Item: Components<any>["Item"] = ({ context: _context, item: _item, ...props }) => {
  return <div {...props} className={style.item} />;
};

const Footer: Components["Footer"] = () => <Fragment />;
