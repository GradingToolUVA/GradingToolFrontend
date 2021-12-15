import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Typography } from 'antd';
import { HighlightOutlined, SmileOutlined, SmileFilled } from '@ant-design/icons';

const { Paragraph, Title } = Typography;

const Editable = ({type, level}) => { //destructure the props
  const [editableStr, setEditableStr] = useState('');
  if (type === "title") {
    return (
      <Title 
        editable={{ onChange: setEditableStr}}
        level={level}
        onClick={event => {
          event.stopPropagation(); //prevent collapse trigger
        }}
        style={{marginLeft:"10px",display:"inline-block"}}
      >
        {editableStr}
      </Title>
    );
  } else {
    return (
      <Paragraph editable={{ onChange: setEditableStr }}>{editableStr}</Paragraph>
    );
  }
};

export default Editable;