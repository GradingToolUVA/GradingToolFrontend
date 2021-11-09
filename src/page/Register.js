import React from "react";

import { Button, Input, Form, Checkbox, message, Image, Select} from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";

import { register } from "../api/user";
import uvalogo from "../asset/image/uvalogo.png";

class Register extends React.Component {
  onFinish = (values) => {
    console.log("REGISTER")
    const {username, email, password, password2} = values
    if (password !== password2) {
      //this.props.createMessage({ passwordNotMatch: 'Passwords do not match' });
      message.error("Passwords do not match!")
    } else {
      const newUser = {
        username,
        password,
        email,
      };
      register(newUser)
        .then((res) => {
          message.success("Created User")
          console.log(res)
        })
        .catch((err) => {
          message.error("Registration failed")
          console.log(err)
        })
    }
  }

  render() {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src={uvalogo}
          preview={false}
          height="100px"
          width="100px"
        />
        <Form
          name="normal_login"
          style={{ backgroundColor: "#ffffff", marginTop: "50px" }}
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please create your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="password2"
            rules={[
              {
                required: true,
                message: "Please confirm your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Create
            </Button>
            Back to <a href="/login"> login</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Register;