import React from "react";
import { Form } from "antd";

interface IFormField {
  isEdit: boolean;
  form: any;
  rules: any;
  label: string;
  fieldName: string;
  fieldChildren: any;
}

export function FormField(props: IFormField) {
  const { isEdit, form, fieldName, rules, label, fieldChildren } = props;

  return (
    <Form.Item
      label={label}
      name={fieldName}
      children={isEdit ? fieldChildren : form.getFieldValue(fieldName)}
      rules={rules}
    />
  );
}
