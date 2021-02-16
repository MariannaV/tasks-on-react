import React from "react";
import { Form, Input, Button } from "antd";
import { NUsers } from "../../store/@types";
import { FormField } from "../../components/form/formField";
import { usersStore } from "../../store";
import AvatarDefault from "../../assets/img/no-image.png";
import { API_notification } from "../../components/notifications";
import styles from "./index.scss";

export namespace NUserForm {
  export enum FormModes {
    creation = "creation",
    view = "view",
    edit = "edit",
  }

  export interface IForm {
    mode: NUserForm.FormModes;
    id?: number;
    onSubmit?: () => unknown;
  }
}

export function UserForm(props: NUserForm.IForm) {
  const { id } = props;

  const [mode, setMode] = React.useState(props.mode),
    onToggleEditMode = React.useCallback(
      () =>
        setMode((currentMode) =>
          currentMode === NUserForm.FormModes.view
            ? NUserForm.FormModes.edit
            : NUserForm.FormModes.view
        ),
      []
    ),
    [isCreationMode, isEditMode, isViewMode] = [
      NUserForm.FormModes.creation,
      NUserForm.FormModes.edit,
      NUserForm.FormModes.view,
    ].map((currentMode) => currentMode === mode);

  const [userForm] = Form.useForm(),
    initialValues = React.useMemo(() => (!id ? {} : usersStore.map[id]), [id]),
    onSubmit = React.useCallback(
      async (values: NUsers.IUser) => {
        try {
          if (mode === NUserForm.FormModes.view)
            throw Error("Submit should be work only in edit/create modes");

          await usersStore.changeUserData({
            userData: { ...values, id: id! },
            operation: mode,
          });

          userForm.resetFields();

          props.onSubmit?.();

          API_notification.create({
            type: "success",
            message: "Success",
            description:
              props.mode === NUserForm.FormModes.creation
                ? "New user created"
                : "User edited",
          });
        } catch (error) {
          console.error(error);
          API_notification.create({
            type: "error",
            message: "Error",
            description: `Can't ${
              props.mode === NUserForm.FormModes.creation ? "create" : "edit"
            } user with id ${id}`,
          });
        }
      },
      [mode, props.onSubmit, id]
    );

  const deleteUser = React.useCallback(async () => {
    try {
      await usersStore.changeUserData({
        userData: { id: props.id } as any,
        operation: "deletion",
      });
      API_notification.create({
        type: "success",
        message: "Success",
        description: "User deleted",
      });
    } catch (error) {
      console.error(error);
      API_notification.create({
        type: "error",
        message: "Error",
        description: `Can't delete user with id ${props.id}`,
      });
    }
  }, [props.id]);

  const [userImageUrl, setUserImageUrl] = React.useState(
      (initialValues as any)?.avatar ?? AvatarDefault
    ),
    onSetAvatar = React.useCallback(
      (event) => setUserImageUrl(event.target.value),
      []
    ),
    onSetAvatarFailback = React.useCallback(
      () => setUserImageUrl(AvatarDefault),
      []
    );

  return (
    <Form
      className={styles.userModal}
      name={"userForm"}
      form={userForm}
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <img
        src={userImageUrl}
        alt="User avatar"
        className={styles.imageStyles}
        onError={onSetAvatarFailback}
      />

      <FormField
        fieldName={"avatar"}
        label={"Photo"}
        isEdit={!isViewMode}
        form={userForm}
        rules={[{ message: "Please input value!" }]}
        fieldChildren={<Input type="url" onBlur={onSetAvatar} />}
      />

      <FormField
        fieldName={"first_name"}
        label={"First Name"}
        isEdit={!isViewMode}
        form={userForm}
        rules={[{ required: true, message: "Please input value!" }]}
        fieldChildren={<Input />}
      />
      <FormField
        fieldName={"last_name"}
        label={"Last Name"}
        isEdit={!isViewMode}
        form={userForm}
        rules={[{ required: true, message: "Please input value!" }]}
        fieldChildren={<Input />}
      />
      <FormField
        fieldName={"email"}
        label={"Email"}
        isEdit={!isViewMode}
        form={userForm}
        rules={[{ required: true, message: "Please input value!" }]}
        fieldChildren={<Input type="email" />}
      />

      <footer>
        {(() => {
          switch (mode) {
            case NUserForm.FormModes.creation:
              return (
                <Button type="primary" htmlType="submit" children="Create" />
              );

            case NUserForm.FormModes.edit:
            case NUserForm.FormModes.view:
              return (
                <>
                  <Button
                    type="primary"
                    onClick={onToggleEditMode}
                    children={isEditMode ? "View" : "Edit"}
                  />
                  <Button
                    type="primary"
                    onClick={deleteUser}
                    children="Delete user"
                  />
                  {isEditMode && (
                    <Button type="primary" htmlType="submit" children="Save" />
                  )}
                </>
              );
          }
        })()}
      </footer>
    </Form>
  );
}
