import React from "react";

import {
  Layout,
  Menu,
  Button,
  Input,
  Collapse,
  Popover,
  Row,
  Col,
  Select,
  message,
  Dropdown,
  Divider
} from "antd";

import { 
  getSubmission, 
  getSubmissionPages, 
  getComments,
} from '../api/submission'

const { Header, Sider, Content } = Layout;

export default class Export extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submission: {},
      commentedPages: [],
    }
  }

  componentDidMount() {
    getSubmission({exportID: this.props.match.params.id})
      .then((submissionResponse) => {
        message.success("got submission")
        const submissionObj = JSON.parse(submissionResponse.data.content[0])
        console.log(submissionObj)
        const submissionID = submissionObj.id
        getSubmissionPages(submissionID)
          .then((pagesResponse) => {
            const pages = pagesResponse.data.content
            console.log(pages)
            const commentedPages = []
            const getCommentsReqs = []
            for(const p of pages) {
              let request = getComments(p.id)
              commentedPages.push({page: p})
              getCommentsReqs.push(request)
            }
            Promise.all(getCommentsReqs)
              .then((response) => {//retrieve in order
                response.map((res, index) => commentedPages[index].comments = res.data.content)
                this.setState({
                  submission: submissionObj,
                  commentedPages: commentedPages
                }, () => {console.log(this.state.commentedPages)})
              })
              .catch((err) => console.log(err));
          })
          .catch((error) => {
            message.error(error.message)
          })
      })
      .catch((error) => {
        message.error(error.message)
      })
  }

  render() {
    return (
      <Layout>
        <Header
          style={{ 
            height: "53px",
            width: "100%",
            backgroundColor: "#1890FF",
            position: "fixed",
            zIndex: 1
          }}
        >

        </Header>
        <Layout>
          <Sider
            width="18%"
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              paddingTop: "60px"
            }}
          >

          </Sider>
          <Content
            id="content"
            style={{
              margin: "60px 8px 0",
              //overflow: "initial",
              backgroundColor: "#ffffff",
              //padding: "20px 250px 100px",
              paddingLeft: "18%"//"240px"
            }}
          >
            <Row
              style={{position:"relative"}}
            >
              <Col span={16}>
                <iframe
                  id='submission'
                  width="100%"
                  height="100%"
                  src='../submissions/dummy.html'
                  //onLoad={this.loadHandler}
                  //onMouseDown={this.handleMouseDown}
                  //onMouseUp={this.getText}
                />
              </Col>
              <Col id="one" span={8}>
                {this.state.commentedPages.map((cp) => {
                  //const yPos = comment.y + "px"
                  return(
                    <div
                      style={{
                        position:"absolute",
                        //top:comment.y,
                        paddingLeft:"10px"
                      }}
                    >
                      <ExportComment 

                      ></ExportComment>
                      <br></br>
                    </div>
                  )
                })}
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

class ExportComment extends React.Component {
  render() {
    return (
      <p>YESIR</p>
    )
  }
}