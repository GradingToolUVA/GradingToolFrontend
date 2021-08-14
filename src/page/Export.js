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
      commentsToDisplay: 0 //index in commentedPages to display correct set of comments
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
            let landingPgIndex = 0
            const getCommentsReqs = []
            for(var i = 0; i < pages.length; i++) {
              commentedPages.push({page: pages[i]})
              if(pages[i].name === "Landing Page") {
                landingPgIndex = i
              }
              let request = getComments(pages[i].id)
              getCommentsReqs.push(request)
            }
            Promise.all(getCommentsReqs)
              .then((response) => {//retrieve in order
                response.map((res, index) => commentedPages[index].comments = res.data.content)
                this.setState({
                  submission: submissionObj,
                  commentedPages: commentedPages,
                  commentsToDisplay: landingPgIndex
                }, () => {
                  console.log(this.state.commentedPages)
                  // var submission = document.getElementById('submission');
                  // var iframe = submission.contentWindow || ( submission.contentDocument.document || submission.contentDocument);
                  // const __html = this.state.commentedPages[this.state.commentsToDisplay].page.html
                  // iframe.document.open();
                  // iframe.document.write(__html);
                  // iframe.document.close();
                  this.loadPage({key:this.state.commentsToDisplay})
                })
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

  loadHandler = () => { //on iFrame load
    //set the height to fit content
    var submission = document.getElementById("submission");
    submission.style.height = submission.contentWindow.document.body.scrollHeight + 'px'
  }

  loadPage = (item) => {
    const pageToLoad = this.state.commentedPages[item.key]
    var submission = document.getElementById('submission');
    var iframe = submission.contentWindow || ( submission.contentDocument.document || submission.contentDocument);
    const __html = pageToLoad.page.html
    iframe.document.open();
    iframe.document.write(__html);
    iframe.document.close();
    for(const c of pageToLoad.comments) {
      this.highlightComment(c)
    }
    this.setState({commentsToDisplay: item.key})
  }

  highlightComment = (comment) => { //go through the innerHTML of the div inside the body
    var submission = document.getElementById("submission");
    var iframeHTML = submission.contentDocument || submission.contentWindow.document;
    //console.log(iframeHTML.childNodes)
    const nodes = iframeHTML.childNodes[0].childNodes[1].childNodes[0] //gets to the html->body->div
    let innerHTML = nodes.innerHTML //innerHTML of div wrapper
    for(var i = 0; i < comment.text.length; i++) {
      const text = comment.text[i].text //HERE
      var index = this.nthIndexOf(innerHTML, text, comment.text[i].n);
      if (index >= 0) { 
        innerHTML = innerHTML.substring(0,index) + '<span style="background-color: #BDB76B">' + innerHTML.substring(index,index+text.length) + '</span>' + innerHTML.substring(index + text.length);
        nodes.innerHTML = innerHTML;
        //update the state too because the html nodes have changed
      }
    }
  }

  nthIndexOf(str, match, n){ //Find index of nth occurance of match in str
    let i= -1;
    while(n-- && i++ < str.length) {
      i = str.indexOf(match, i);
      if (i < 0) { break }
    }
    return i;
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
            width="23%"
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              paddingTop: "60px"
            }}
          >
            <Menu
              theme="dark"
              onClick={this.loadPage}
            >
              {this.state.commentedPages.map((cp, index) => {
                return (
                  <Menu.Item key={index}>
                    {cp.page.name}
                  </Menu.Item>
                )
              })}
            </Menu>
          </Sider>
          <Content
            id="content"
            style={{
              margin: "60px 8px 0",
              //overflow: "initial",
              backgroundColor: "#ffffff",
              //padding: "20px 250px 100px",
              paddingLeft: "23%"//"240px"
            }}
          >
            <Row
              style={{position:"relative"}}
            >
              <Col span={17}>
                <iframe
                  id='submission'
                  width="100%"
                  height="100%"
                  src='../submissions/dummy.html'
                  onLoad={this.loadHandler}
                />
              </Col>
              <Col id="one" span={7}>
                {this.state.commentedPages[this.state.commentsToDisplay]?.comments.map((c) => {
                  //const yPos = comment.y + "px"
                  return(
                    <div
                      style={{
                        position:"absolute",
                        top: c.y,
                        paddingLeft:"10px"
                      }}
                    >
                      <ExportComment 
                        comment={c}
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
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  displayComment = () => {
    return (
      <div>
        {this.props.comment.commentArray?.map((c, index) => {
          return (
            <div className="commentContent">
              <b>{c.comment} ({c.commentPoints})</b>
              <p>{c.additionalComment}</p>
              <hr/>
            </div>
          )
        })}
      </div>
    )
  }

  handleVisibility = () => {
    this.setState({visible: this.state.visible ? false : true})
  }

  render() {
    return (
      <Popover 
        content={this.displayComment}
        placement="rightTop"
        trigger="click"
        visible={this.state.visible}
      >
        <Button danger="true" size="small" onClick={this.handleVisibility}>
          {this.props.comment.points}
        </Button>
      </Popover>
    )
  }
}