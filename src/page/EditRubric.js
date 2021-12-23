import React from 'react';

import {
  Button,
  Input,
  InputNumber,
  message,
  Form,
  Select,
  DatePicker,
  Upload,
  Typography,
  Divider,
  Space, 
  Collapse,
  Card
} from "antd";

import CSRFToken from '../component/CSRFToken'
import Editable from '../component/Editable'
import { updateRubric, getRubricById } from '../api/rubric'
import { postSubmission } from '../api/submission'
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  DownSquareTwoTone,
  CloseSquareTwoTone
} from "@ant-design/icons";

const {Option} = Select
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

class EditRubric extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tenCooledDown: true, //for the 10 second cooldown
      changed: false,
      name: "",
      layout: { //for the fill-out rubric, start with one empty
        sections: [ 
          {
            name: "",
            ptsEarned: 0,
            ptsPossible: 0,
            criteria: [
              {
                name: "",
                ptsEarned: 0,
                ptsPossible: 0,
                comments: [
                  {
                    text: {
                      shortenedText: "[Short Text]",
                      fullText: "[Full Text]"
                    },
                    value: 0
                  }
                ]
              }
            ]
          }
        ],
      }
    }
  }

  componentDidMount() {
    getRubricById(this.props.match.params.id)
      .then((response) => {
        console.log(response.data.content.rubric)
        const rubric = JSON.parse(response.data.content.rubric)
        let newLayout = {
          sections: rubric.template
        }
        this.setState({
          layout: newLayout,
          name: rubric.assignment_name
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  addNewSection = () => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections.push({
      name: "",
      ptsEarned: 0,
      ptsPossible: 0,
      criteria: [
        {
          name: "",
          ptsEarned: 0,
          ptsPossible: 0,
          comments: [
            {
              text: {
                shortenedText: "[Short Text]",
                fullText: "[Full Text]"
              },
              value: 0
            }
          ]
        }
      ]
    })
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  addNewCriteria = (sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria.push({
      name: "",
      ptsEarned: 0,
      ptsPossible: 0,
      comments: [
        {
          text: {
            shortenedText: "[Short Text]",
            fullText: "[Full Text]"
          },
          value: 0
        }
      ]
    })
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  addComment = (sIndex, cIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments.push({
      text: {
        shortenedText: "[Short Text]",
        fullText: "[Full Text]"
      },
      value: 0
    })
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  removeSection = (sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections.splice(sIndex, 1) 
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  removeCriteria = (sIndex, cIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria.splice(cIndex, 1)
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  removeComment = (sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments.splice(cmIndex, 1)
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  changeSectionName = (e, sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].name = e.target.value
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  changeSectionPoints = (value, sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].ptsEarned = value
    updatedLayout.sections[sIndex].ptsPossible = value
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  changeCriteriaName = (e, sIndex, cIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].name = e.target.value
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  changeCriteriaPoints = (value, sIndex, cIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].ptsEarned = value
    updatedLayout.sections[sIndex].criteria[cIndex].ptsPossible = value
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  changeCommentShort = (value, sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments[cmIndex].text.shortenedText = value
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  changeCommentFull = (value, sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments[cmIndex].text.fullText = value
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  changeCommentValue = (value, sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments[cmIndex].value = value
    this.setState({
      layout: updatedLayout,
      changed: true,
    }, ()=> {
      this.updateTemplate();
    })
  }

  updateTemplate = () => {
    if(this.state.tenCooledDown) {
      const params = {template: this.state.layout.sections}
      console.log(params)
      updateRubric(this.props.match.params.id, params)
        .then((response) => {
          message.success("Updated template")
          this.setState({
            tenCooledDown: false
          })
        })
        .catch((error) => {
          message.error("Failed to update template")
          console.log(error)
        })
      setTimeout(() => {
        this.setState({tenCooledDown: true})
      }, 10000)
    }
  }

  render() {
    return (
      <div style={{paddingLeft: "20px", paddingRight: "10px", paddingBottom: "20px"}}>
        <Divider orientation="left">{this.state.name}</Divider>
        <Form colon={true} labelAlign="left" onFinish={this.finishRubric}>
          <div style={{ backgroundColor : "#9ac8de",}}>
            {this.state.layout.sections.map((s, sIndex) => (
              <Collapse defaultActiveKey="1">
                <Panel key="1" showArrow={false} style={{backgroundColor:"#9ac8de"}}
                  header={ //THE HEADER FOR A SECTION
                    <div>
                      <span onClick={e => {e.preventDefault(); e.stopPropagation();}}>
                        <Input onChange={(e)=>{this.changeSectionName(e, sIndex)}} value={s.name}style={{width:"20%",marginLeft:"10px",display:"inline-block"}}></Input>
                        <InputNumber defaultValue={s.ptsPossible} onChange={(value)=>{this.changeSectionPoints(value, sIndex)}} size="medium" placeholder="Points" style={{marginLeft:"10px", display:"inline-block"}}/>
                      </span>
                      <CloseSquareTwoTone style={{float:"right", fontSize:"large"}} twoToneColor="red"
                        onClick={event => {
                          event.stopPropagation(); 
                          this.removeSection(sIndex);
                        }}
                      />
                    </div>
                  }
                >
                  <div style={{backgroundColor : "#9fe6e2",}}>
                    {this.state.layout.sections[sIndex].criteria.map((c, cIndex) => (
                      <Collapse defaultActiveKey="1">
                        <Panel key="1" showArrow={false} style={{backgroundColor:"#9fe6e2"}}
                          header={
                            <div>
                              <span onClick={e => {e.preventDefault(); e.stopPropagation();}}>
                                <Input onChange={(e)=>{this.changeCriteriaName(e, sIndex, cIndex)}} value={c.name}style={{width:"20%",marginLeft:"10px",display:"inline-block"}}></Input>
                                <InputNumber defaultValue={c.ptsPossible} onChange={(value)=>{this.changeCriteriaPoints(value, sIndex, cIndex)}} size="medium" placeholder="Points" style={{marginLeft:"10px", display:"inline-block"}}/>
                              </span>
                              <CloseSquareTwoTone style={{float:"right", fontSize:"large"}} twoToneColor="red"
                                onClick={event => {
                                  event.stopPropagation();
                                  this.removeCriteria(sIndex, cIndex);
                                }}
                              />
                            </div>
                          }
                        >
                          <div style={{display:"flex", overflowX:"scroll"}}>
                            {this.state.layout.sections[sIndex].criteria[cIndex].comments.map((cm, cmIndex) => {
                              return (
                                <Card size="small" style={{ height: 250, width:"250px",marginRight:"15px", marginBottom:"5px"}}
                                  title={
                                    <div style={{width:"225px"}}>
                                      <InputNumber defaultValue={cm.value} onChange={(value)=>{this.changeCommentValue(value, sIndex, cIndex, cmIndex)}} size="small" placeholder="Points"/>
                                      <CloseSquareTwoTone twoToneColor="red" style={{float:"right", fontSize:"large"}}
                                        onClick={(event) => {
                                          this.removeComment(sIndex,cIndex,cmIndex)
                                        }}
                                      />
                                    </div>
                                  }
                                >
                                  <div>
                                    <Paragraph strong editable={{onChange:(value)=>{this.changeCommentShort(value,sIndex,cIndex,cmIndex)}}}>{cm.text.shortenedText}</Paragraph>
                                    <Paragraph editable={{onChange:(value)=>{this.changeCommentFull(value,sIndex,cIndex,cmIndex)}}} style={{marginLeft:"15px"}}>{cm.text.fullText}</Paragraph>
                                  </div>
                                </Card>
                              )
                            })}
                            <Button primary shape="circle" style={{marginTop:"115px"}} icon={<PlusOutlined/>}
                              onClick={()=>{this.addComment(sIndex, cIndex)}}
                            ></Button>
                          </div>
                        </Panel>
                      </Collapse>
                    ))}
                  </div>
                  <Button type="solid" block style={{backgroundColor: 'transparent', borderColor:'black',marginBottom:'10px',marginTop:'10px'}}
                    onClick={() => {
                      this.addNewCriteria(sIndex);
                    }}                  
                  ><PlusOutlined />Add Criteria</Button>
                </Panel>
              </Collapse>
            ))}
          </div>
          <Button type="solid" block style={{backgroundColor: 'transparent', borderColor:'black',marginBottom:'10px',marginTop:'10px'}}
            onClick={() => {
              //add();
              this.addNewSection();
            }}
          ><PlusOutlined /> Add Section</Button>
        </Form>
        {/* <Button onClick={this.makeRubric}>Make Rubrics</Button> */}
      </div>
    );
  }
}

export default EditRubric;