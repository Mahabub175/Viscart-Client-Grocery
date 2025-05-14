import { Form, Input } from "antd";

const CustomInput = ({
  type,
  name,
  label,
  max,
  value,
  required,
  prefix,
  placeholder,
  disabled,
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: `${label} is required` }]}
    >
      {(type === "password" && (
        <Input.Password
          placeholder={`Please Enter ${label}`}
          size="large"
          allowClear
          max={max}
        />
      )) ||
        (type === "textarea" && (
          <Input.TextArea
            placeholder={`Please Enter ${label}`}
            size="large"
            allowClear
            max={max}
          />
        )) || (
          <Input
            type={type}
            placeholder={placeholder ? placeholder : `Please Enter ${label}`}
            size="large"
            allowClear
            value={value}
            max={max}
            min={type === "number" ? 0 : undefined}
            prefix={prefix ? prefix : null}
            onWheel={(e) => type === "number" && e.target.blur()}
            disabled={disabled}
          />
        )}
    </Form.Item>
  );
};

export default CustomInput;
