import React from "react";
import { notification } from "antd";
import * as AntNotification from "antd/lib/notification";

interface INotificationCreator extends AntNotification.ArgsProps {}

export const API_notification = {
  create: (settings: INotificationCreator) =>
    notification[settings.type!](settings),
};
