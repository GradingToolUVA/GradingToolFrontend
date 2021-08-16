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
    CheckOutlined,
    CloseOutlined,
    CommentOutlined
  } from "@ant-design/icons";

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

    handleVisibility = () => {
      this.setState({visible: this.state.visible ? false : true})
      //this.props.highlightComment(this.props.comment)
    }

    displayComment = () => {
      console.log(this.props.comment.commentArray)
      return (
        <div>
          {this.props.comment.commentArray?.map((c, index) => {
            console.log(c.additionalComment)
            return (
              <div className="commentContent">
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
                <Popover content={this.props.anotherComment(this.props.comment.sectionName, this.props.comment.y)} placement="bottomRight" trigger="click">
                  <Button size="small" icon={<CommentOutlined />}style={{float:"right",marginRight:"3px"}}/>
                </Popover>
                <br/>
                <Text strong editable={{tooltip:false, onChange: (string) => {this.props.editCommentText(this.props.comment.y, string, index)}}}>{c.comment}</Text>
                {c.additionalComment !== ""
                  ? <Paragraph editable={{tooltip:false, onChange: (string) => {this.editAdditionalComment(string, index)}}}>
                      {c.additionalComment}
                    </Paragraph>
                  : [
                      (this.state.addingNewExtra[index] === true
                        ? (
                            <div>
                              <TextArea 
                                placeholder="extra comment" 
                                autoSize
                                value={this.state.additionalComments[index] ? this.state.additionalComments[index] : ""}
                                onChange={(e) => {this.additionalCommentChange(e, index)}}
                              />
                              <div style={{color:"white", paddingTop:"4px", paddingBottom:"4px"}}>
                                <Button 
                                  type="primary"
                                  size="small" 
                                  style={{float:"right"}}
                                  icon={<CheckOutlined />}
                                  onClick={() => {
                                    const text = this.state.additionalComments[index];
                                    //console.log(text)
                                    this.additionalComment(text, this.props.comment.y, index)
                                  }}
                                />
                                <Button 
                                  danger
                                  size="small" 
                                  style={{float:"right"}}
                                  icon={<CloseOutlined />}
                                  onClick={() => {
                                    this.cancelAdditionalComment(index)
                                  }}
                                />
                              </div>
                            </div>
                          )
                        : <Button size="small" type="link" onClick={() => {this.addingExtraComment(index)}}>Add extra comment</Button>
                      )
                    ]
                }
                <hr/>
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
      this.state.addingNewExtra[index] = true
      this.setState({addingNewExtra: this.state.addingNewExtra})
    }

    additionalComment = (text, y, index) => {
      this.state.addingNewExtra[index] = false
      this.setState({addingNewExtra: this.state.addingNewExtra})
      this.props.additionalComment(text, y, index)
    }

    cancelAdditionalComment = (index) => {
      this.state.addingNewExtra[index] = false
      this.state.additionalComments[index] = ""
      this.setState({
        addingNewExtra: this.state.addingNewExtra,
        additionalComments: this.state.additionalComments
      })
    }

    editAdditionalComment = (additionalComment, index) => {
      this.state.additionalComments[index] = additionalComment
      this.setState({additionalComments: this.state.additionalComments})
      this.props.additionalComment(additionalComment, this.props.comment.y, index)
    }

    additionalCommentChange = (e, index) => {
      this.state.additionalComments[index] = e.target.value
      this.setState({additionalComments: this.state.additionalComments})
    }

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