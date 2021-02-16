import React from "react";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";
import { UserForm, NUserForm } from "./userForm";

interface IUserModal extends ModalProps {
  isVisible: null | boolean;
  setVisible: React.Dispatch<React.SetStateAction<IUserModal["isVisible"]>>;
  formProps: NUserForm.IForm;
}

export function UserModal(props: IUserModal) {
  const { isVisible, setVisible, formProps, ...restProps } = props;

  const onCloseModal = React.useCallback(() => setVisible(false), []);

  if (isVisible === null) return null;

  return (
    <Modal
      title="User modal"
      visible={Boolean(isVisible)}
      onOk={onCloseModal}
      onCancel={onCloseModal}
      children={<UserForm onSubmit={onCloseModal} {...formProps} />}
      footer={null}
      {...restProps}
    />
  );
}
