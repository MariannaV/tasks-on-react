import React from "react";
import { Spin } from "antd";
import { SpinProps } from "antd/lib/spin";
import styles from "./index.scss";

interface ILoader extends SpinProps {}

export function Loader(props: ILoader): React.ReactElement {
  const { className, ...restProps } = props,
    classes = React.useMemo(
      () => [styles.loader, props.className].filter(Boolean).join(" "),
      [props.className]
    );

  return <Spin size="default" className={classes} {...restProps} />;
}
