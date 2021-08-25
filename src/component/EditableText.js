import React from "react";
import {
  Input,
  Button
} from 'antd';
import {
  EditTwoTone,
  CheckSquareTwoTone,
  CloseSquareTwoTone,
} from "@ant-design/icons";

const {TextArea} = Input;

class EditableText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editingMode: this.props.defaultEdit,
      text: this.props.text
    }
  }

  activateEditingMode = () => {
    this.setState({editingMode: true})
  }

  deactivateEditingMode = () => {
    this.setState({
      editingMode: false,
      text: this.props.text
    })
    if(this.props.onCancel !== undefined) {
      this.props.onCancel(this.props.index)
    }
  }

  editFinish = () => {
    if(this.props.index === undefined) {
      this.props.onEditFinish(this.state.text)
    } else {
      this.props.onEditFinish(this.state.text, this.props.index)
    }
    this.setState({editingMode: false})
  }

  changeText = (e) => {
    this.setState({
      text: e.target.value
    })
  }

  render() {
    if(this.state.editingMode) {
      return (
        <div style={{width:"100%"}}>
          <TextArea value={this.state.text} onChange={this.changeText}/>
          <span>
            <Button 
              size="small" 
              style={{float:"right", border:"none", marginTop:"2px"}}
              icon={<CheckSquareTwoTone twoToneColor="#52c41a"/>}
              onClick={this.editFinish}
            />
            <Button 
              size="small" 
              style={{float:"right", border:"none", marginTop:"2px"}}
              icon={<CloseSquareTwoTone twoToneColor="#eb2f96"/>}
              onClick={this.deactivateEditingMode}
            />
          </span>
          <p> </p>
        </div>
      )
    } else {//just display 
      const fb = this.props.text.split(/\r|\n/);
      return (
        <div>
          {fb.map((t, index) => {
            return (
              <div style={{color:"black"}}>
                <p style={{margin:"0",display: index === fb.length - 1?"inline-block":""}}>{t}</p> 
                {index === fb.length - 1 && 
                  <Button 
                    size="small" 
                    style={{border:"none",display:"inline-block"}} 
                    icon={<EditTwoTone/>}
                    onClick={this.activateEditingMode}
                  />
                }
              </div>
            )
          })}
        </div>
      );
    }
  }
}

export default EditableText;