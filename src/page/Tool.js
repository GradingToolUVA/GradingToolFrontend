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
  Divider,
  Typography
} from "antd";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DownOutlined, 
  ReloadOutlined,
  ExportOutlined,
} from "@ant-design/icons";

import CSRFToken from "../component/CSRFToken";
import Comment from '../component/Comment'
import '../asset/css/ToolContent.css'
import '../asset/css/ToolSider.css'

import { getCurrentHTML, getAllLinkedPages } from "../api/htmls";
import { getRubricByName } from '../api/rubric'
import { 
  getSubmission, 
  getSubmissionPages, 
  postComment, 
  getComments,
  patchComment,
  deleteComment, 
  postSubmission,
  updateSubmission
} from '../api/submission'

import cryptoRandomString from 'crypto-random-string';

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { Paragraph } = Typography;

class Tool extends React.Component {
  constructor(props) {
    super(props)
    this.submissionRef = React.createRef()
    this.state = {
      loading: true,
      x: 0,
      y: 0,
      yOffset: 0,
      xHighlight: 0,
      yHighlight: 0,
      highlight_textString: "",
      ellipsisExpanded: false,
      highlight_text: [],//"",
      n: 0, //highlighted text is the nth occurance of that text in the submission
      submissionNodes: [], //the nodes of the html of the submission
      submissionID: 0,
      comments: [], //array of objects containing the comment and other data
        /*{ 
            id:,
            pageid:,
            x:, 
            y:, //unique identifier
            text: [{text:, n:}]
            sectionName:,
            points:,
            commentArray: [{}]
              {  
                comment:, 
                additionalComment:, 
                commentPoints:,                  
                criteriaName:, 
              }
          }*/
      semesters: ["Spring 2019", "Spring 2021", "Fall 2020"],
      semester: "", //track current semester to display
      teams: ["lions", "cats"],
      team: 0, //track current team to display, use integer for arrow navigation
      phases: ["Phase 2", "Phase 1", "Phase 3", "Phase 4"],
      phase: "",
      phaseSections: [],
        /*{
          name:, //unique
          url:, 
          html:,
          ptsEarned:,
          ptsPossible:,
          criteria: [
            {
              name:, //unique
              ptsEarned:, 
              ptsPossible:,
              comments: [ //This is the possible comments
                {
                  text: {
                    shortenedText:,
                    fullText:
                  }, 
                  value:
                }
              ] 
            }],
          currComments: this is the current comments for this section
        }*/
      pages: [],
      currentSection: "Landing Page",
      exportID: "",
    }
  }

  componentDidMount() {
    var content = document.getElementById("content")
    const yOffset = content.getBoundingClientRect().top; //left to get x-offset
    //console.log("Y-offset:" + yOffset)
    this.setState({
      yOffset: yOffset, 
      semester: this.state.semesters[0],
      team: 0,
      phase: this.state.phases[0], 
    }, () => {this.loadSubmission()})
  }

  loadSubmission = () => {
    var submission = document.getElementById('submission');
    var iframe = submission.contentWindow || ( submission.contentDocument.document || submission.contentDocument);
    let baseURL = "https://sites.google.com/vt.edu/hci-"
    const sem = this.state.semester.substring(0,1).toLowerCase() + this.state.semester.substring(this.state.semester.length - 2, this.state.semester.length)
    const team = this.state.teams[this.state.team]
    const phase = this.state.phase.split(" ").join("-").toLowerCase()
    let url = baseURL + sem + "-team-" + team + "/" + phase + "?authuser=0"
    url = encodeURIComponent(url)
    getSubmission({group_name:team, assignment_name:this.state.phase, semester:sem})
      .then((submissionResponse) => {
        const submissionObj = JSON.parse(submissionResponse.data.content[0])
        const submissionID = submissionObj.id
        const exportID = submissionObj.export_id
        console.log(submissionObj)
        getRubricByName(this.state.phase)
          .then((rubricResponse) => {
            const rubricObj = JSON.parse(rubricResponse.data.content[0].rubric)
            console.log(rubricObj)
            getSubmissionPages(submissionID)//this.state.phase, sem)
              .then((pagesResponse) => {
                const pages = pagesResponse.data.content
                console.log(pages)
                //LOAD THE SUBMISSION DATA
                const phaseSections = []
                const extras = []
                for(const section of submissionObj.template) {
                  const toAdd = {
                    name: section.name,
                    ptsEarned: section.ptsEarned,
                    ptsPossible: section.ptsPossible,
                    criteria: section.criteria,
                    currComments: section.currComments
                  } 
                  const page = pages.filter(p => p.name === section.name)
                  if(pages.filter(p => p.name === section.name).length > 0) {//there is a separate page for 
                    toAdd.url = page[0].url
                    toAdd.html = page[0].html
                  } else {
                    toAdd.url = ""
                    toAdd.html = ""
                  }
                  if(rubricObj.template.filter(r => r.name === section.name).length > 0) { //is not extra section  
                    phaseSections.push(toAdd)
                  } else { //is an extra section
                    extras.push(section)
                  }
                }
                for(const p of pages) { //either this or the above will populate the extras
                  //check if the section exists
                  if(phaseSections.filter(s => s.name === p.name).length === 0) {
                    const toAdd = {
                      name: p.name,
                      ptsEarned: 0,
                      ptsPossible: 0,
                      criteria: [],
                      currComments: [],
                      url: p.url,
                      html: p.html
                    } 
                    extras.push(toAdd)
                  }
                }
                console.log(phaseSections)
                console.log(extras)
                this.setState({
                  phaseSections: phaseSections,
                  pages: pages,
                  submissionID: submissionID,
                  exportID: exportID,
                })
                //LOAD THE ACTUAL HTML
                const landingPg = pages.filter(p => p.name === "Landing Page")[0]
                const __html = landingPg.html
                iframe.document.open();
                iframe.document.write(__html);
                iframe.document.close();
                iframe.addEventListener("pointerdown", this.handleMouseDown);  
                iframe.addEventListener("pointerup", this.getText);
              })
              .catch((error) => {
                message.error(error.message)
                console.log(error.response)
              })
          })
          .catch((error) => {
            message.error(error.message)
            console.log(error.response)
          })
      })
      .catch((error) => {
        if(error.response.status === 400) { //then create the submission    
          getRubricByName(this.state.phase)
            .then((response) => {
              const rubric_id = response.data.content[0].id
              const export_id = cryptoRandomString({length: 15})
              const params = {
                encoded_url: url,
                group: ["Jack"],
                group_name: team,
                assignment_id: rubric_id,
                semester: sem,
                export_id: export_id
              }
              postSubmission(params)
                .then((response) => {
                  message.success("New submission detected, please refresh")
                })
                .catch((error) => {
                  message.error(error.message)
                  console.log(error.response)
                })
            })
            .catch((error) => {
              message.error(error.message)
              console.log(error.response)
            })
        } else {
          message.error(error.message)
        }
      })
    /*getCurrentHTML(url)
      .then((response) => {
        console.log(response)
        const __html = response.data.content[0].html
        iframe.document.open();
        iframe.document.write(__html);
        iframe.document.close();
        iframe.addEventListener("pointerdown", this.handleMouseDown);  
        iframe.addEventListener("pointerup", this.getText);
      })
      .catch((error) => {console.log(error.message)})
    getAllLinkedPages(url)
      .then((response) => {
        const pattern = "/vt.edu/hci-" + sem + "-team-" + team + "/" + phase
        const links = response.data.content
        //console.log(links)
        const sections = []
        for(const link of links) {
          if(link.url.includes(pattern) && link.url !== pattern) {
            link.ptsEarned = 20;
            link.ptsPossible = 20;
            const comments = [{text: "No Data", value: -10},
                              {text: "Incomplete", value: -5},
                              {text: "Lacking", value: -2},
                              {text: "Great Job! You did an great one here", value: 0},]
            link.criteria = [{name:"Preparation", ptsEarned:10, ptsPossible:10, comments:comments,},
                             {name:"Description", ptsEarned:10, ptsPossible:10, comments:comments,},]
            link.currComments = []
            sections.push(link)
          }
        }
        this.setState({
          phaseSections: sections,
          loading: false,
        }, () => {console.log(this.state.phaseSections)}) //what if sections is empty?
      })
      .catch((error) => {console.log(error.message)})*/
  }
  
  loadHandler = () => { //on iFrame load
    //set the height to fit content
    var submission = document.getElementById("submission");
    submission.style.height = submission.contentWindow.document.body.scrollHeight + 'px'
      //populate submissionNodes
    var iframeHTML = submission.contentDocument || submission.contentWindow.document;
    console.log("*******")
    console.log(iframeHTML.childNodes)
    const nodes = iframeHTML.childNodes[0]?.childNodes //gets to the [head, body] level
    const bodyNodes = nodes[1]?.childNodes[0]?.childNodes //body->div->sections
    console.log(typeof bodyNodes)
    const submissionNodes = []
    if(bodyNodes?.length > 0) {
      for(const node of bodyNodes) {
        submissionNodes.push(node)
      }
    } 
    console.log(submissionNodes)
    this.setState({
      submissionNodes: submissionNodes,  
    }, () => {this.highlightAllComments()})
    console.log(submissionNodes)
  }

  highlightAllComments = () => {
    for(const c of this.state.comments) {
      this.highlightComment(c)
    }
  }

  loadPhaseSection = (section) => {
    var submission = document.getElementById('submission');
    var iframe = submission.contentWindow || ( submission.contentDocument.document || submission.contentDocument);
    iframe.document.open();
    iframe.document.write(section.html);
    iframe.document.close();
    iframe.addEventListener("pointerdown", this.handleMouseDown);  
    iframe.addEventListener("pointerup", this.getText);
    const p = this.state.pages.filter(p => p.name === section.name)
    if(p.length > 0) {
      const id = p[0].id
      getComments(id)
        .then((response) => {
          const responseComments = response.data.content
          console.log(responseComments)
          this.setState({
            currentSection: section.name,
            comments: responseComments,
          })
        })
        .catch((error) => {
          message.error(error.message)
        })
    } else {
      console.log("Page for this section is not found.")
    }
  }
  
  handleMouseDown = (e) => {
    //screenY vs pageY vs clientY --> page accounts for scroll
    var x = e.clientX //- rect.left; //x position on screen
    var y = e.pageY //- this.state.yOffset//- rect.top;
    this.setState({ x: x, y: y });
    //console.log(y)
  }

  getText = (e) => { //Used Selection javascript documentation
    var iframe = document.getElementById('submission');
    iframe = iframe.contentWindow || ( iframe.contentDocument.document || iframe.contentDocument);
    const selection = iframe.getSelection()
    const text = selection.toString()
    console.log("text:" + text)
    if(text !== "") { //what if image?
      //must determine whether we are looking for the focus or the anchor (highlighted backwards)
      const anchorOffset = selection.anchorOffset
      const focusOffset = selection.focusOffset
      const anchor = selection.anchorNode.parentNode
      console.log(anchor.outerHTML)
      const focus = selection.focusNode.parentNode
      console.log(focus.outerHTML)
      let htmlToSearch = ""
      if(anchor === focus) {
        const n = this.getN(anchor, text, anchorOffset)
        this.setState({
          highlight_text: [{text: text, n: n}],
          n: n,
        })
      } else { //anchor !== focus
        //for every node involved, store the text for that node individually
        //find the number of occurances of that specific text
        //eventually have something like [{text, n}, {text, n}, {text, n}...] 
          //one object for each section and then highlight each accordingly
        const textArray = text.split("\n") //gives [text1, "", text2, etc.]
        console.log(anchorOffset)
        console.log(focusOffset)
        const anchorN = this.getN(anchor, textArray[0], anchorOffset - textArray[0].length) //account for anchor offset being at front vs focus being at back
        const focusN = this.getN(focus, textArray[2], focusOffset)
        this.setState({
          highlight_text: [{text: textArray[0], n: anchorN}, {text: textArray[2], n: focusN}],
          n: 1,
        })
      }
    }
    this.setState({
      xHighlight: Math.round(this.state.x),
      yHighlight: Math.round(this.state.y),
      highlight_textString: text
    })
  }

  getN = (selectedNode, text, offset) => { //if this returns '4', then 'text' is the 4th occurance of 'text' inside the page's html
    let htmlToSearch = ""
    for(const node of this.state.submissionNodes) {
      const outerHTML = node.outerHTML   
      if(outerHTML?.includes(selectedNode.outerHTML)) {
        console.log(true)
        const startOfNode = outerHTML.indexOf(selectedNode.outerHTML)
        const splitByHighlighted = selectedNode.outerHTML.split(text)
        if(splitByHighlighted.length > 2) {
          //add everything before and including the highlighted part
          let i = selectedNode.outerHTML.indexOf(text);
          while(i > -1) {
            console.log(i)
            console.log(selectedNode.outerHTML.charAt(i + text.length - 1 - offset))
            if(selectedNode.outerHTML.charAt(i + text.length - 1 - offset) === '>') {
              //console.log(true)
              break;
            } else{
              i = selectedNode.outerHTML.indexOf(text, i + text.length);
            }
          }
          const addToSearch = outerHTML.substring(0, startOfNode) + selectedNode.outerHTML.substring(0, i + text.length)
          htmlToSearch += addToSearch
        } else { //there is only one occurance
          const addToSearch = outerHTML.substring(0, startOfNode) + selectedNode.outerHTML
          htmlToSearch += addToSearch
        }

        //check that, "offset" characters before the last index of the occurance, the text all matches up
        break;
      } else {
        //add to the string to search, to find how many times it occurs later
        htmlToSearch += outerHTML
      }
    }
    console.log(htmlToSearch)
    const occurances = htmlToSearch.split(text)
    console.log(occurances)
    const n = occurances.length - 1
    return n
  }

  addComment = (sectionName, critName, comment, y) => {
    for(const section of this.state.phaseSections) {
      if(section.name === sectionName) {
        for(const criteria of section.criteria) {
          if(criteria.name === critName) {
            section.ptsEarned += comment.value;
            section.currComments.push(comment)
            criteria.ptsEarned += comment.value;
            this.setState({
              phaseSections: this.state.phaseSections
            }, () => {
              const patchTemplate = this.getSubmissionTemplatePatch()
              const params = {template: patchTemplate}
              console.log(params)
              updateSubmission(this.state.submissionID, params)
                .then((response) => {
                  message.success("Updated template")
                })
                .catch((error) => {
                  message.error("Failed to update template")
                  console.log(error)
                })
            })
          }
        }
      }
    }
    if(y === -1) {
      const c = {
        x: this.state.xHighlight,
        y: this.state.yHighlight - 10,
        text: this.state.highlight_text,
        //n: this.state.n, //nth occurance of the text
        /*text: {
          text: this.state.highlight_text,
          n: this.state.n
        },*/
        sectionName: sectionName,
        points: comment.value,
        commentArray: [{
          comment: comment.text.fullText,
          commentPoints: comment.value,
          additionalComment: "",
          criteriaName: critName,
        }],
      }
        //MAKE THE COMMENT POST REQUEST
      const p = this.state.pages.filter(p => p.name === sectionName)
      if(p.length > 0) {
        const pageid = p[0].id
        postComment(pageid, c)
          .then((response) => {
            console.log(response)
            message.success("Posted comment")
            const commentID = response.data.content.id
            c.id = commentID
            c.page = pageid
            this.highlightComment(c)
            console.log(c)
            const comments = [...this.state.comments, c]
            comments.sort((a, b) => a.y - b.y)
            this.adjustPositions(comments) //Avoid overlapping comments
            this.setState({
              comments: comments,
            })
          })
          .catch((error) => {
            message.error(error.message)
          })
      } else {
        console.log("Page for this section is not found.")
      }
    } else {
      for(const c of this.state.comments) {
        if(c.y === y) {
          const toAdd = {
            comment: comment.text.fullText,
            commentPoints: comment.value,
            additionalComment: "",
            criteriaName: critName,
          }
          c.commentArray.push(toAdd)
          c.points += comment.value
          this.setState({
            comments: this.state.comments,
          })
          patchComment(c.id, {points: c.points, commentArray: c.commentArray})
            .then((response) => {
              message.success("Additional comment added")
            })
            .catch((error) => {
              message.error(error.message)
            })
          break;
        }
      }
    }
  }

  getSubmissionTemplatePatch = () => {
    const toPatch = []
    for(const s of this.state.phaseSections) {
      const toAdd = {
        name: s.name,
        ptsEarned: s.ptsEarned,
        ptsPossible: s.ptsPossible,
        criteria: s.criteria,
        currComments: s.currComments
      } 
      toPatch.push(toAdd)
    }
    return toPatch
  }

  anotherComment = (sectionName, y) => {
      //y is used to find the comment in state.comments
    const section = this.state.phaseSections.filter(s => {
      return s.name === sectionName
    })
    const criteria = section[0].criteria
    return(
      <div>
        {criteria.map((crit) => {
          return (
            <div key={crit.name}>
              <Popover placement="right" content={this.getComments(sectionName, crit.name, y)}>
                <Button size="small" style={{width:"100%", maxWidth:"150px"}}>
                  {crit.name}
                </Button>
              </Popover>
            </div>
          )
        })}
      </div>
    )
  }

  adjustPositions(comments) {
    let patchReqs = []
    for(var i = 0; i < comments.length - 1; i++) {
      if(comments[i].y > comments[i+1].y - 30) {
        comments[i+1].y = comments[i].y + 30
        let req = patchComment(comments[i+1].id, {y: comments[i+1].y})
        patchReqs.push(req)
      }
    }
    Promise.all(patchReqs) 
      .then((response) => {
        message.success("Updated positions");
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  highlightComment = (comment) => { //go through the innerHTML of the div inside the body
    var submission = document.getElementById("submission");
    var iframeHTML = submission.contentDocument || submission.contentWindow.document;
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

  unhighlightComment = (text, n) => {
    var submission = document.getElementById("submission");
    var iframeHTML = submission.contentDocument || submission.contentWindow.document;
    const nodes = iframeHTML.childNodes[0].childNodes[1].childNodes[0] //gets to the html->body->div
    let innerHTML = nodes.innerHTML //innerHTML of div wrapper
    var index = this.nthIndexOf(innerHTML, text, n);
    if (index >= 0) { 
      innerHTML = innerHTML.substring(0,index-40) + innerHTML.substring(index,index+text.length) + innerHTML.substring(index + text.length + 7);
      nodes.innerHTML = innerHTML;
      //update the state too because the html nodes have changed
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

  changeSemester = (value) => {
    this.setState({
      semester: value
    }, () => {this.loadSubmission()})
  }
  changeTeam = (value) => {
    const index = this.state.teams.indexOf(value)
    this.setState({
      team: index
    }, () => {this.loadSubmission()})
  }
  changeTeamBack = () => {
    let index;
    if(this.state.team === 0) {
      index = this.state.teams.length - 1
    } else {
      index = this.state.team - 1
    }
    this.setState({
      team: index
    }, () => {this.loadSubmission()})
  }
  changeTeamNext = () => {
    let index;
    if(this.state.team === this.state.teams.length - 1) {
      index = 0
    } else {
      index = this.state.team + 1
    }
    this.setState({
      team: index
    }, () => {this.loadSubmission()})
  }
  changePhase = (value) => {
    this.setState({
      phase: value
    }, () => {this.loadSubmission()})
  }

  getCurrComments = (currComments) => {
    return (
      <div>
        {currComments.map((comment) => (
          <div style={{color: "black"}}>{comment.value}: {comment.text.fullText}</div>
        ))}
      </div>
    )
  }

  getComments = (sectionName, critName, y=-1) => { //Display the comments interface
    const section = this.state.phaseSections.filter(s => {
      return s.name === sectionName
    })
    const crit = section[0].criteria.filter(c => {
      return c.name === critName
    })
    return (
      <div>
        {crit[0].comments.map((comment) => (
          <div>
            <Button 
              size="small"
              onClick={() => {this.addComment(sectionName, critName, comment, y)}}
              style={{
                color: "black", 
                border: "solid black", 
                width:"100%",
                maxWidth:"175px",
                height:"100%",
                textAlign: "left",
                whiteSpace: "pre-wrap"
              }}
            >
              {comment.value}: {comment.text.shortenedText}
            </Button>
          </div>
        ))}
        <Button  //The CUSTOM comment button
          size="small"
          style={{
            color: "black", 
            border: "solid black", 
            width:"100%",
            textAlign: "right"
          }}
        >
          Custom
        </Button>
      </div>
    )
  }

  ptValueChange = (value, comment, originalPoints, index) => { //pass to Comment
    if(isNaN(value) === false) {
      console.log(value)
      console.log(originalPoints)
      const y = comment.y
      let ptDiff = value - originalPoints
      for(const c of this.state.comments) {
        if(c.y === y) {
          c.points += ptDiff
          c.commentArray[index].commentPoints = value
          break;
        }
      }
      for(const s of this.state.phaseSections) {
        if(s.name === comment.sectionName) {
          for(const c of s.criteria) {
            if(c.name === comment.commentArray[index].criteriaName) {
              s.ptsEarned += ptDiff;
              c.ptsEarned += ptDiff;
              break;
            }
          }
        }
      }
      this.setState({
        comments: this.state.comments,
        phaseSections: this.state.phaseSections,
      })
    }
  }

  editCommentText = (y, newCommentText, index) => {
    const commentsCopy = this.state.comments
    for(const comment of commentsCopy) {
      if(comment.y === y) {
        comment.commentArray[index].comment = newCommentText
      }
    }
    this.setState({comments: commentsCopy})
  }

  deleteAdditionalComment = (y, index) => { //pass to Comment
    for(const comment of this.state.comments) {
      if(comment.y === y) {
        comment.commentArray[index].additionalComment = ""
      }
    }
    this.setState({comments: this.state.comments})
  }

  additionalComment = (text, y, index) => { //pass to Comment
    for(const comment of this.state.comments) {
      if(comment.y === y) {
        comment.commentArray[index].additionalComment = text
      }
    }
    this.setState({comments: this.state.comments})
  }

  deleteComment = (y, index) => { //pass to Comment
    for(var i = 0; i < this.state.comments.length; i++) {
      const comment = this.state.comments[i]
      if(comment.y === y) {
        const deleteID = comment.id
        const text = comment.text
        const n = comment.n 
        const sectionName = comment.sectionName
        const critName = comment.commentArray[index].criteriaName
        const commentText = comment.commentArray[index].comment
        const pts = comment.commentArray[index].commentPoints
        console.log(pts)
        comment.commentArray.splice(index, 1)
        if(comment.commentArray.length === 0) {
          this.state.comments.splice(i, 1) //delete the comment
          this.unhighlightComment(text, n)
        } else {
          comment.points -= pts; //or adjust its points
        }
        deleteComment(deleteID)
          .then((response) => {
            message.success("Deleted comment")
          })
          .catch((error) => {
            message.error(error.message)
          })
        this.setState({ comments: this.state.comments })
        for(const s of this.state.phaseSections) {
          if(s.name === sectionName) {
            for(let i = 0; i < s.currComments.length; i++) {
              if(s.currComments[i].value === pts && s.currComments[i].text.fullText === commentText) {
                s.currComments.splice(i, 1)
                break; //wont match if comment text has been edited
              }
            }
            for(const c of s.criteria) {
              if(c.name === critName) {
                s.ptsEarned -= pts;
                c.ptsEarned -= pts;
                this.setState({phaseSections: this.state.phaseSections}, () => {
                  const patchTemplate = this.getSubmissionTemplatePatch()
                  const params = {template: patchTemplate}
                  console.log(params)
                  updateSubmission(this.state.submissionID, params)
                    .then((response) => {
                      message.success("Updated template")
                    })
                    .catch((error) => {
                      message.error("Failed to update template")
                      console.log(error)
                    })
                })
                break;
              }
            }
          }
        }
        break;
      }
    }
  }

  toggleEllipsis = () => {
    this.setState({ellipsisExpanded: this.state.ellipsisExpanded ? false : true})
  }

  saveComments = () => {
    let patchReqs = []
    console.log(this.state.comments)
    for(const c of this.state.comments) {
      let req = patchComment(c.id, c)
      patchReqs.push(req)
    }
    Promise.all(patchReqs) 
      .then((response) => {
        message.success("Saved all comments");
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  exportSubmission = () => {
    const exportID = this.state.exportID
    window.open('submission/'+ exportID, '_blank').focus();
  }

  render() {
    const menu = (
      <Menu>
        {this.state.pages.map((p) => {
          if(p.name !== "Landing Page") {
            const url = "https://sites.google.com" + p.url
            return (
              <Menu.Item>
                <a target="_blank" rel="noreferrer" href={url}>
                  {p.name}
                </a>
              </Menu.Item>
            )
          } else {
            return (
              <Menu.Item>
                <a target="_blank" rel="noreferrer" href={p.url}>
                  {p.name}
                </a>
              </Menu.Item>
            )
          }
        })}
      </Menu>
    );

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
          <div>
            <Dropdown overlay={menu} style={{display:"inline-block"}}>
              <a style={{color:"black"}}>
                Go directly to submission site <DownOutlined />
              </a>
            </Dropdown>
            <div style={{display:"inline-block", float:"right"}}>
              <Button style={{display:"inline-block", marginRight:"5px"}} icon={<ReloadOutlined />}></Button>
              <Button style={{display:"inline-block"}} onClick={this.saveComments}>Save</Button>
            </div>
          </div>
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
            <div className="siderElementContainer">Semester: 
              <Select 
                className="semesterSelect"
                defaultValue={this.state.semesters[0]} 
                onChange={(value) => this.changeSemester(value)}
                size="small"
              >
                {this.state.semesters.map((sem) => (
                  <Option value={sem}>{sem}</Option>
                ))}
              </Select>
            </div>
            <div className="siderElementContainer">Team:
              <Button
                size="small"
                style={{ display: "inline", background: "transparent", border: "none" }}
                icon={<CaretLeftOutlined style={{ color: "white" }} />}
                onClick={this.changeTeamBack}
              />
              <Select 
                value={this.state.teams[this.state.team]} 
                onChange={(value) => this.changeTeam(value)}
                size="small"
                style={{width:"50%"}}
              >
                {this.state.teams.map((team) => (
                  <Option value={team}>{team}</Option>
                ))}
              </Select>
              <Button
                size="small"
                style={{ display: "inline", background: "transparent", border: "none" }}
                icon={<CaretRightOutlined style={{ color: "white" }} />}
                onClick={this.changeTeamNext}
              />
            </div>
            <div className="siderElementContainer">Phase: 
              <Select 
                defaultValue={this.state.phases[0]} 
                onChange={(value) => this.changePhase(value)}
                size="small"
                style={{paddingLeft:"5px", paddingTop:"5px"}}
              >
                {this.state.phases.map((p) => (
                  <Option value={p}>{p}</Option>
                ))}
              </Select>
            </div>
            <p/>
            <div className="siderElementContainer">
              <p>System:</p>
              <div style={{border:"1px solid white", maxWidth:"100%", wordWrap: "break-word"}}>
                <Paragraph ellipsis={this.state.ellipsisExpanded === false ? true : false} 
                  style={{color:"white"}}
                >
                  {this.state.highlight_textString}
                </Paragraph>
              </div>
              <Button size="small" type="link" style={{float:"right"}} onClick={this.toggleEllipsis}>{this.state.ellipsisExpanded ? "less" : "more"}</Button>
              <p/>
            </div>
            <div className="siderElementContainer">
              <p>Comment:</p>
              {this.state.phaseSections.map((section) => {
                return (
                  <Collapse key={section.name}className="collapse">
                    <Panel
                      header={section.name}
                      extra={                    
                        <Popover 
                          className="mainPopover" 
                          placement="right" 
                          title="Current Comments" 
                          content={this.getCurrComments(section.currComments)} 
                          trigger="hover"
                        >
                          <Button className="mainGrade" size="small" onClick={() => {this.loadPhaseSection(section)}}>
                            <sup>{section.ptsEarned}</sup>&frasl;<sub>{section.ptsPossible}</sub>
                          </Button>
                        </Popover>  
                      }  
                    >
                      {section.criteria.map((crit) => {
                        return (
                          <div key={crit.name}>
                            <Button className="subCategory" size="small">{crit.name}</Button>
                            <Popover className="subGrade" placement="rightBottom" content={this.getComments(section.name, crit.name)}>
                              <Button className="commentButton" size="small">
                                <sup>{crit.ptsEarned}</sup>&frasl;<sub>{crit.ptsPossible}</sub>
                              </Button>
                            </Popover>
                          </div>
                        )
                      })}
                    </Panel>
                  </Collapse>
                )
              })}
            </div>
            <p></p>
            <Button
              type="primary"
              icon={<ExportOutlined />}
              shape="round"
              onClick={this.exportSubmission}
              style={{float:"right", marginRight:"5px"}}
            >
              Export
            </Button>
            <Divider/>
            <div style={{color:"black"}}>***Grading Tool 2021***</div>
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
                  //scrolling="no"
                  onLoad={this.loadHandler}
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.getText}
                />
              </Col>
              <Col id="one" span={7}>
                {/*<div className="commentDiv">One</div>
                <Button size="small" style={{borderColor:"#90ee90", color:"#90ee90"}}>+1</Button><br></br>*/}
                {this.state.comments.map((comment) => {
                  //const yPos = comment.y + "px"
                  return(
                    <div
                      style={{
                        position:"absolute",
                        top:comment.y,
                        paddingLeft:"10px"
                      }}
                    >
                      <Comment 
                        comment={comment}
                        highlightComment={this.highlightComment}
                        ptValueChange={this.ptValueChange}
                        additionalComment={this.additionalComment}
                        anotherComment={this.anotherComment}
                        deleteAdditionalComment={this.deleteAdditionalComment}
                        deleteComment={this.deleteComment}
                        editCommentText={this.editCommentText}
                      ></Comment>
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

export default Tool;