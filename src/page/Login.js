import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth';

import { Button, Input, Form, Checkbox, message, Image, Select } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

import uvalogo from "../asset/image/uvalogo.png";

class Login extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired, 
    isAuthenticated: PropTypes.bool,
  };

  onFinish = (values) => {
    this.props.login(values.username, values.password);
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/create" />;
    }
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
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {/* <a style={{ float: "right" }} href="">
                Forgot password
              </a> */}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Log in
            </Button>
            Or <a href="/register">register now!</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ //map state (state of a specified reducer) to the props of this Login component
  isAuthenticated: state.auth.isAuthenticated, //state.auth means we want the auth reducer
});

export default connect(mapStateToProps, { login })(Login);