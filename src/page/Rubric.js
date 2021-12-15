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
import { postRubric, getRubricByName } from '../api/rubric'
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

class Rubric extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      template: {},
      comments: [1,1,1],
      layout: { //for the fill-out rubric, start with one empty
        sections: [ 
          {
            name: "[New Section]",
            ptsEarned: 0,
            ptsPossible: 0,
            criteria: [
              {
                name: "[New Criteria]",
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

  finishRubric = (values) => { //the manual rubric upload 
    console.log(this.state.layout)
    const datetime = values.duedate._d.toJSON().split("T")
    const date = datetime[0]
    const dateSplit = date.split("-")
    const time = datetime[1]
    const timeSplit = time.split(":")
    let hour = parseInt(timeSplit[0])
    hour = hour < 4 ? 24 + (hour - 4) : hour - 4 //gmt to est conversion
    const toUpload = {
      template: this.state.layout.sections,
      year: parseInt(dateSplit[0]),
      month: parseInt(dateSplit[1]),
      day: parseInt(dateSplit[2]),
      hour: parseInt(hour),
      minute: parseInt(timeSplit[1]),
      name: values.assignment_name
    }
    postRubric(toUpload)
      .then((response) => {
        message.success("Made Rubric");
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  submitRubric = (values) => { //submits a JSON file rubric
    const datetime = values.duedate._d.toJSON().split("T")
    const date = datetime[0]
    const dateSplit = date.split("-")
    const time = datetime[1]
    const timeSplit = time.split(":")
    let hour = parseInt(timeSplit[0])
    hour = hour < 4 ? 24 + (hour - 4) : hour - 4 //gmt to est conversion
    const toUpload = {
      template: this.state.template,
      year: parseInt(dateSplit[0]),
      month: parseInt(dateSplit[1]),
      day: parseInt(dateSplit[2]),
      hour: parseInt(hour),
      minute: parseInt(timeSplit[1]),
      name: values.assignment_name
    }
    postRubric(toUpload)
      .then((response) => {
        message.success("Made Rubric");
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  addNewSection = () => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections.push({
      name: "[New Section]",
      ptsEarned: 0,
      ptsPossible: 0,
      criteria: [
        {
          name: "[New Criteria]",
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
    this.setState({layout: updatedLayout})
  }

  addNewCriteria = (sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria.push({
      name: "[New Criteria]",
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
    this.setState({layout: updatedLayout})
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
    this.setState({layout: updatedLayout})
  }

  removeSection = (sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections.splice(sIndex, 1) 
    this.setState({layout: updatedLayout})
  }

  removeCriteria = (sIndex, cIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria.splice(cIndex, 1)
    this.setState({layout: updatedLayout})
  }

  removeComment = (sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments.splice(cmIndex, 1)
    this.setState({layout: updatedLayout})
  }

  changeSectionName = (e, sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].name = e.target.value
    this.setState({layout: updatedLayout})
  }

  changeSectionPoints = (value, sIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].ptsEarned = value
    updatedLayout.sections[sIndex].ptsPossible = value
    this.setState({layout: updatedLayout})
  }

  changeCriteriaName = (e, sIndex, cIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].name = e.target.value
    this.setState({layout: updatedLayout})
  }

  changeCriteriaPoints = (value, sIndex, cIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].ptsEarned = value
    updatedLayout.sections[sIndex].criteria[cIndex].ptsPossible = value
    this.setState({layout: updatedLayout})
  }

  changeCommentShort = (value, sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments[cmIndex].text.shortenedText = value
    this.setState({layout: updatedLayout})
  }

  changeCommentFull = (value, sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments[cmIndex].text.fullText = value
    this.setState({layout: updatedLayout})
  }

  changeCommentValue = (value, sIndex, cIndex, cmIndex) => {
    var updatedLayout = {...this.state.layout}
    updatedLayout.sections[sIndex].criteria[cIndex].comments[cmIndex].value = value
    this.setState({layout: updatedLayout})
  }

  render() {
    return (
      <div style={{paddingLeft: "20px", paddingRight: "10px", paddingBottom: "20px"}}>
        <Divider orientation="left">Create Rubric</Divider>
        <Form colon={true} labelAlign="left" onFinish={this.finishRubric}>
          <Form.Item name="assignment_name" label="Assignment"
            rules={[{required: true, message: "Please select the assignment",},]}>
            <Select style={{width:"250px"}}>
              <Option key={1} value="Phase 1">Phase 1</Option>
              <Option key={2} value="Phase 2">Phase 2</Option>
              <Option key={3} value="Phase 3">Phase 3</Option>
              <Option key={4} value="Phase 4">Phase 4</Option>
            </Select>
          </Form.Item>
          <Form.Item name="duedate" label="Due Date"
            rules={[{required: true,},]}>
            <DatePicker use12Hours showTime/>
          </Form.Item>
          <div style={{ backgroundColor : "#9ac8de",}}>
            {this.state.layout.sections.map((s, sIndex) => (
              <Collapse defaultActiveKey="1">
                <Panel key="1" showArrow={false} style={{backgroundColor:"#9ac8de"}}
                  header={ //THE HEADER FOR A SECTION
                    <div>
                      <span onClick={e => {e.preventDefault(); e.stopPropagation();}}>
                        <Input onChange={(e)=>{this.changeSectionName(e, sIndex)}} value={s.name}style={{width:"20%",marginLeft:"10px",display:"inline-block"}}></Input>
                        <InputNumber onChange={(value)=>{this.changeSectionPoints(value, sIndex)}} size="medium" placeholder="Points" style={{marginLeft:"10px", display:"inline-block"}}/>
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
                                <InputNumber onChange={(value)=>{this.changeCriteriaPoints(value, sIndex, cIndex)}} size="medium" placeholder="Points" style={{marginLeft:"10px", display:"inline-block"}}/>
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
                                      <InputNumber onChange={(value)=>{this.changeCommentValue(value, sIndex, cIndex, cmIndex)}} size="small" placeholder="Points"/>
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
          <Button htmlType="submit" type="primary">Upload</Button>
        </Form>
        <Divider orientation="left">Upload rubric with JSON Template</Divider>
        {/* <Button onClick={this.makeRubric}>Make Rubrics</Button> */}
        <Form
          colon={true}
          labelAlign="left"
          onFinish={this.submitRubric}
        >
          <Form.Item
            name="assignment_name"
            label="Assignment"
            rules={[
              {
                required: true,
                message: "Please select the assignment",
              },
            ]}
          >
            <Select
              style={{width:"250px"}}
            >
              <Option key={1} value="Phase 1">Phase 1</Option>
              <Option key={2} value="Phase 2">Phase 2</Option>
              <Option key={3} value="Phase 3">Phase 3</Option>
              <Option key={4} value="Phase 4">Phase 4</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="duedate"
            label="Due Date"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker use12Hours showTime/>
          </Form.Item>
          <Form.Item
            name="template"
            label="Rubric File"
            rules={[
              {
                required: true,
                message: "Please select the assignment",
              },
            ]}
          >
            <Upload
              accept=".txt, .json"
              showUploadList={true}
              maxCount={1}
              beforeUpload={file => {
                const reader = new FileReader();

                reader.onload = e => {
                  //console.log(e.target.result);
                  const template = e.target.result
                  const jsontemp = JSON.parse(template)
                  //console.log(jsontemp.template)
                  this.setState({
                    template: jsontemp.template
                  }, () => {
                    message.success("File uploaded");
                  })
                };
                reader.readAsText(file);
                return true;
              }}
              onChange={(info) => { //does nothing, just turns it normal state instead of red
                info.file.status = "done"
              }}
            >
              <Button icon={<UploadOutlined/>}>Upload </Button>
            </Upload>
          </Form.Item>
          <Button htmlType="submit" type="primary">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default Rubric;