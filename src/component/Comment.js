import React from "react";
import ReactDOM from "react-dom"

import {
  Layout,
  Menu,
  Button,
  Input,
  Divider,
  Collapse,
  Popover,
  Row,
  Col,
  InputNumber,
  Modal,
  Typography
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckSquareTwoTone,
  CloseSquareTwoTone,
  CommentOutlined,
  PlusSquareOutlined
} from "@ant-design/icons";

import EditableText from "./EditableText";

import '../asset/css/ToolContent.css'

const { SubMenu } = Menu;
const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { confirm } = Modal;

class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      additionalComments: [],
      addingNewExtra: [], //array of booleans indicating whether a new "extra comment" is being written for a given comment in this Comment
    }
  }

  componentDidMount() {
    const a = []
    const adding = []
    for(const c of this.props.comment.commentArray) {
      a.push(c.additionalComment)
      adding.push(false)
    }
    this.setState({
      additionalComments: a,
      addingNewExtra: adding
    })
  }

  componentDidUpdate(prevProps) {
    if(this.props.comment.commentArray.length > this.state.additionalComments.length) {
      const additionalComments = [...this.state.additionalComments]
      const addingNewExtra = [...this.state.addingNewExtra]
      for(var i = 0; i < this.props.comment.commentArray.length - this.state.additionalComments.length; i++)
      {
        additionalComments.push("")
        addingNewExtra.push(false)
      }
      this.setState({
        additionalComments: additionalComments,
        addingNewExtra: addingNewExtra
      })
    }
  }

  handleVisibility = () => {
    this.setState({visible: this.state.visible ? false : true})
    //this.props.highlightComment(this.props.comment)
  }

  displayComment = () => {
    return (
      <div>
        {this.props.comment.commentArray?.map((c, index) => {
          console.log(this.props.comment.commentArray)
          console.log(this.state.addingNewExtra)
          return (
            <div className="commentContent">
              {index !== 0 && <hr/>}
              <InputNumber
                size="small"
                value={c.commentPoints} 
                onChange={(value) => {this.props.ptValueChange(value, this.props.comment, c.commentPoints, index)}}
                style={{width:"35%"}} 
              />
              <Button 
                size="small" 
                danger
                icon={<DeleteOutlined />}
                style={{float:"right"}}
                onClick={() => {this.deleteCommentHandler(this.props.comment.y, index)}}
              />
              <Popover content={this.props.anotherComment(this.props.comment.sectionName, this.props.comment.y)} placement="bottomRight" trigger="hover">
                <Button size="small" icon={<CommentOutlined />}style={{float:"right",marginRight:"3px"}}/>
              </Popover>
              <br/>
              <Text strong editable={{tooltip:false, onChange: (string) => {this.props.editCommentText(this.props.comment.y, string, index)}}}>{c.comment}</Text>
              <Button size="small" icon={<PlusSquareOutlined/>} style={{border:"none"}} onClick={() => {this.addingExtraComment(index)}}></Button>
              {c.additionalComment !== ""
                ? <div>
                    <EditableText 
                      defaultEdit={false}
                      text={c.additionalComment}
                      index={index}
                      onEditFinish={this.editAdditionalComment}
                    />
                  </div>
                  // <Paragraph editable={{tooltip:false, onChange: (string) => {this.editAdditionalComment(string, index)}}}>
                  //   {c.additionalComment}
                  // </Paragraph>
                : [
                    (this.state.addingNewExtra[index] === true
                      ? (
                          <div>
                            <EditableText 
                              defaultEdit={true}
                              text=""
                              index={index}
                              onEditFinish={this.editAdditionalComment}
                              onCancel={this.cancelAdditionalComment}
                            />
                            <p> </p>
                            {/* <TextArea 
                              placeholder="extra comment" 
                              autoSize
                              value={this.state.additionalComments[index] ? this.state.additionalComments[index] : ""}
                              onChange={(e) => {this.additionalCommentChange(e, index)}}
                            />
                            <div style={{color:"white", paddingTop:"4px", paddingBottom:"4px"}}>
                              <Button 
                                size="small" 
                                style={{float:"right", border:"none"}}
                                icon={<CheckSquareTwoTone twoToneColor="#52c41a"/>}
                                onClick={() => {
                                  const text = this.state.additionalComments[index];
                                  this.additionalComment(text, this.props.comment.y, index)
                                }}
                              />
                              <Button 
                                danger
                                size="small" 
                                style={{float:"right", border:"none"}}
                                icon={<CloseSquareTwoTone twoToneColor="#eb2f96"/>}
                                onClick={() => {
                                  this.cancelAdditionalComment(index)
                                }}
                              />
                            </div>
                            <p> </p> */}
                          </div>
                        )
                      : <br/>//<Button size="small" type="link" onClick={() => {this.addingExtraComment(index)}}>Add extra comment</Button>
                    )
                  ]
              }
            </div>
          )
        })}
        {/*<Popover content={this.props.anotherComment(this.props.comment.sectionName, this.props.comment.y)} placement="top" trigger="click">
          <Button type="primary" size="small">
            Add another comment
          </Button>
        </Popover>*/}
      </div>
    )
  }

  addingExtraComment = (index) => {
    console.log(this.state.additionalComments[index])
    console.log(this.state.additionalComments[index] === "")
    const addingNewExtra = [...this.state.addingNewExtra]
    if(this.state.additionalComments[index] === "") {
      addingNewExtra[index] = true
      this.setState({addingNewExtra: addingNewExtra})
    }
  }

  additionalComment = (text, y, index) => {
    const addingNewExtra = [...this.state.addingNewExtra]
    addingNewExtra[index] = false
    //this.state.addingNewExtra.push(false)
    //this.state.additionalComments.push("")
    this.setState({
      addingNewExtra: addingNewExtra,
      //additionalComments: this.state.additionalComments
    })
    this.props.additionalComment(text, y, index)
  }

  cancelAdditionalComment = (index) => {
    const addingNewExtra = [...this.state.addingNewExtra]
    addingNewExtra[index] = false
    //this.state.additionalComments[index] = ""
    this.setState({
      addingNewExtra: addingNewExtra,
      //additionalComments: this.state.additionalComments
    }, () => {console.log(this.state.addingNewExtra[index])})
  }

  editAdditionalComment = (additionalComment, index) => {
    const addingNewExtra = [...this.state.addingNewExtra]
    const additionalComments = [...this.state.additionalComments]
    addingNewExtra[index] = false
    additionalComments[index] = additionalComment
    this.setState({
      addingNewExtra: addingNewExtra,
      additionalComments: additionalComments
    })
    this.props.additionalComment(additionalComment, this.props.comment.y, index)
  }

  // additionalCommentChange = (e, index) => {
  //   this.state.additionalComments[index] = e.target.value
  //   this.setState({additionalComments: this.state.additionalComments})
  // }

  deleteCommentHandler = (y, index) => {
    confirm({
      title: "Are you sure?",
      okText: "Confirm",
      content: "This will delete the current comment.",
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        this.props.deleteComment(y, index)
      },
    })
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

export default Comment;