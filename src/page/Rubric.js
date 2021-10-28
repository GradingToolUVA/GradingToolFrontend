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
  Space
} from "antd";

import CSRFToken from '../component/CSRFToken'
import { postRubric, getRubricByName } from '../api/rubric'
import { postSubmission } from '../api/submission'
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";

const {Option} = Select
const { Title } = Typography;

class Rubric extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      template: {}
    }
  }

  //********** Outdated methods **********
  makeRubric = () => {
    const phase1 = {
      template: [
        {
          name: "Report and Structure",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Instructions",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Requirements", 
                    fullText:"Not all the requirements of the assignment met"
                  }, 
                  value: -10
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Problem Identification",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Process",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Detail of Process", 
                    fullText:"Missing details in the process description"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Findings",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Learning through Research", 
                    fullText:"What did you learn through the research?"
                  }, 
                  value: -5
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Client",
          ptsEarned: 5,
          ptsPossible: 5,
          criteria: [
            {
              name: "Rationale",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Client Detail/Rationale", 
                    fullText:"Missing details about the client and rationale for choosing them"
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Contact Info", 
                    fullText:"Provided contact info"
                  }, 
                  value: 1
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Concept Statement",
          ptsEarned: 15,
          ptsPossible: 15,
          criteria: [
            {
              name: "Right Size & Style",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Mission of Product", 
                    fullText:"Mission of product not complete"
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Not 'we will do'", 
                    fullText:"Not 'we will do'"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"< 150 words", 
                    fullText:"< 150 words"
                  }, 
                  value: -1
                },
              ]
            },
            {
              name: "Who, What, How?",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Target audience", 
                    fullText:"Didn't explain target audience"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Problem it solves", 
                    fullText:"Didn't explain the problem it will solve"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"How it solves the problem", 
                    fullText:"Didn't explain how the problem will be solved"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Specificity and UX",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Vague statements", 
                    fullText:"Vague statements, lack of precision"
                  }, 
                  value: -2
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Technical Summary",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Content",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Technologies used", 
                    fullText:"Didn't explain what technologies you will be using"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Diagram",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Diagram explains 'how'", 
                    fullText:"Diagram didn't explain the 'how'"
                  }, 
                  value: -5
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Research/Analysis",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Process",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Detail of process", 
                    fullText:"Process description not detailed enough"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Findings",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Learning from research", 
                    fullText:"Didn't fully explain what was learned from research"
                  }, 
                  value: -2
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Design",
          ptsEarned: 15,
          ptsPossible: 15,
          criteria: [
            {
              name: "Design",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"What was the design?", 
                    fullText:"Design was unclear (sketches, ideation, ?)"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Process",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Missing details", 
                    fullText:"Process description is missing details"
                  }, 
                  value: -2
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Prototyping",
          ptsEarned: 15,
          ptsPossible: 15,
          criteria: [
            {
              name: "Prototype",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Reasonable rapid prototype?", 
                    fullText:"Not a reasonable rapid prototype"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Process",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Missing details", 
                    fullText:"Process description is missing details"
                  }, 
                  value: -2
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Evaluation",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Process",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Actual process not elaborate", 
                    fullText:"The actual process is not elaborate"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Findings",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Learning about your design?", 
                    fullText:"Doesn't fully explain what you learned about your design"
                  }, 
                  value: -3
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Creativity & Above+Beyond",
          ptsEarned: 0,
          ptsPossible: 0,
          criteria: [
            {
              name: "Out of the Box",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Creative teamwork", 
                    fullText:"Teamwork to tackle the problem was creative"
                  }, 
                  value: 5
                },
              ]
            },
            {
              name: "Professional Presentation",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Effort visible in presentation", 
                    fullText:"Could tell a lot of effort was spent on presenting the work"
                  }, 
                  value: 5
                },
              ]
            },
          ],
          currComments: []
        },
      ],
      points: {ptsEarned: 100, ptsPossible: 100},
      //criteria: [],
      year: 2021,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      name: "Phase 1"
    }
    const phase2 = {
      template: [
        {
          name: "Concept Statement",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Revision",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Revisions not complete", 
                    fullText:"Revisions do not fully address change of plans, new findings, and feedback from your client."
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Rationale",
              ptsEarned: 3,
              ptsPossible: 3,
              comments: [
                {
                  text: {
                    shortenedText:"Rationale not clear", 
                    fullText:"Rationale is not clear."
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Client Contact",
              ptsEarned: 2,
              ptsPossible: 2,
              comments: [
                {
                  text: {
                    shortenedText:"Missing client contact", 
                    fullText:"Client contact is missing/incomplete."
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Technical Summary",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Technical summary provided", 
                    fullText:"Technical summary is provided"
                  }, 
                  value: 2
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Contextual Inquiry",
          ptsEarned: 30,
          ptsPossible: 30,
          criteria: [
            {
              name: "Preparation",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Work roles and user classes", 
                    fullText:"Missing parts about work roles/user classes and distribution of interviewees between them."
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"How user classes chosen", 
                    fullText:"Missing parts about how you came up with the user classes and why it makes sense for the domain."
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Description",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Users of the current system", 
                    fullText:"Missing parts about accessing, recruiting, and observing users of the current system."
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Interview Data",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Questions are lacking", 
                    fullText:"Questions are not fully relevant to the domain and work role."
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Did not follow interview advice", 
                    fullText:"Did not follow the advice about taking interviews."
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Raw Work Activity",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Artifacts are not fully informational", 
                    fullText:"Artifacts do not fully address how people are doing the tasks now, what tools/resources, they are using, and what are they struggling with."
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Bonus for CI",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Bonus for CI", 
                    fullText:"Bonus for CI"
                  }, 
                  value: 2
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Contextual Analysis",
          ptsEarned: 30,
          ptsPossible: 30,
          criteria: [
            {
              name: "Note Extraction",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Data and notes not side by side", 
                    fullText:"Raw data and work activity notes not shown side by side."
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Missing note extraction process", 
                    fullText:"Did not explain the process of note extraction"
                  }, 
                  value: -3
                },
                {
                  text: {
                    shortenedText:"Have ID on note", 
                    fullText:"Shouldn't have the ID on the note"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "WAAD Description",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Missing parts", 
                    fullText:"Description is missing parts."
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "WAAD Creation",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Creation process is missing parts", 
                    fullText:"The creation process is missing parts."
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "WAAD Quality",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"No arcs", 
                    fullText:"No arcs"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Color inconsistency", 
                    fullText:"Colors are inconsistent"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Readibility", 
                    fullText:"Lost points for readability"
                  }, 
                  value: -2
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Requirements",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "List of Requirements",
              ptsEarned: 8,
              ptsPossible: 8,
              comments: [
                {
                  text: {
                    shortenedText:"At least 10 requirements", 
                    fullText:"Did not have at least 10 requirements."
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Quality of Requirements", 
                    fullText:"Lost points for quality of the requirements"
                  }, 
                  value: -4
                },
                {
                  text: {
                    shortenedText:"Structured and Table format", 
                    fullText:"Not well structured / not in table format"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Connections",
              ptsEarned: 2,
              ptsPossible: 2,
              comments: [
                {
                  text: {
                    shortenedText:"No requirement connection", 
                    fullText:"Missing requirement connection."
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Connection to WAAD", 
                    fullText:"Missing connection to WAAD"
                  }, 
                  value: -1
                },
              ]
            },
            {
              name: "Prioritizing",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Prioritized requirements", 
                    fullText:"Prioritized the requirements."
                  }, 
                  value: 1
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Modeling",
          ptsEarned: 20,
          ptsPossible: 20,
          criteria: [
            {
              name: "Flow Models",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Wrong format", 
                    fullText:"Wrong format: entities, stock images, arcs, etc."
                  }, 
                  value: -3
                },
                {
                  text: {
                    shortenedText:"CP: Barriers", 
                    fullText:"CP: Barriers"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"EP: improvements", 
                    fullText:"EP: No improvement between the two flow models"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Action verbs", 
                    fullText:"Arc/entity labels with action verbs"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Boundary", 
                    fullText:"Boundary"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Quality: paper vs. digital", 
                    fullText:"Quality: paper vs. digital"
                  }, 
                  value: -1
                },
              ]
            },
            {
              name: "Other Model & Why?",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"No other model", 
                    fullText:"Did not give other model"
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Explanation for other model lacking", 
                    fullText:"Did not give complete explanation/reasoning for other model"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Description",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Description is not complete", 
                    fullText:"Description is not complete"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Extra Models",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Provided extra models", 
                    fullText:"Provided extra models"
                  }, 
                  value: 5
                },
              ]
            },
          ],
          currComments: []
        },
      ],
      points: {ptsEarned: 100, ptsPossible: 100},
      //criteria: [],
      year: 2021,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      name: "Phase 2"
    }
    const phase3 = {
      template: [
        {
          name: "Persona",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Process",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Work role/user class not explained", 
                    fullText:"Work role/user class not explained"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Candidate personas not explained", 
                    fullText:"Candidate personas not explained"
                  }, 
                  value: -3
                },
              ]
            }, 
            {
              name: "Rick and Sticky",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Did not include image", 
                    fullText:"Did not include image"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Missing good presentation with details", 
                    fullText:"Missing good presentation with details"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Bonus",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Candidate personas fully fleshed", 
                    fullText:"Candidate personas are fully fleshed out"
                  }, 
                  value: 2
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Planning and Ideation",
          ptsEarned: 20,
          ptsPossible: 20,
          criteria: [
            {
              name: "Analysis",
              ptsEarned: 2,
              ptsPossible: 2,
              comments: [
                {
                  text: {
                    shortenedText:"Does not explain how analysis helped", 
                    fullText:"Does not fully explain how the analysis helped you"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Task List",
              ptsEarned: 3,
              ptsPossible: 3,
              comments: [
                {
                  text: {
                    shortenedText:"Too few tasks (<6)", 
                    fullText:"Too few tasks (<6)"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"No user activities", 
                    fullText:"No user activities"
                  }, 
                  value: -1
                },
                {
                  text: {
                    shortenedText:"Missing key tasks", 
                    fullText:"Missing key tasks"
                  }, 
                  value: -1
                },
              ]
            },
            {
              name: "Sketching",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Thoughtfulness and readability", 
                    fullText:"Points lost for thoughtfulness and readability"
                  }, 
                  value: -3
                },
                {
                  text: {
                    shortenedText:"Does not represent meaningful tasks", 
                    fullText:"Does not represent meaningful tasks"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Insufficient number of sketches", 
                    fullText:"Insufficient number of sketches"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Lack of clarity", 
                    fullText:"Lack of clarity"
                  }, 
                  value: -1
                },
              ]
            },
            {
              name: "Description",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Diverge", 
                    fullText:"Diverge"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Converge", 
                    fullText:"Converge"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Bonus",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Great sketches", 
                    fullText:"Great sketches"
                  }, 
                  value: 3
                },
                {
                  text: {
                    shortenedText:"Thorough explanation", 
                    fullText:"Thorough explanation of alternatives"
                  }, 
                  value: 2
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Designer's Mental Model",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "System Image",
              ptsEarned: 7,
              ptsPossible: 7,
              comments: [
                {
                  text: {
                    shortenedText:"System explanation lacking", 
                    fullText:"System explanation lacking"
                  }, 
                  value: -4
                },
              ]
            },
            {
              name: "Breakpoints",
              ptsEarned: 3,
              ptsPossible: 3,
              comments: [
                {
                  text: {
                    shortenedText:"Missing anticipated breakpoints", 
                    fullText:"Missing anticipated breakpoints between models"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Bonus",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Mental model multiple perspectives", 
                    fullText:"Included mental model from multiple perspectives"
                  }, 
                  value: 1
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Conceptual Design",
          ptsEarned: 20,
          ptsPossible: 20,
          criteria: [
            {
              name: "Process",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Didn't describe CD creation", 
                    fullText:"Didn't describe CD creation"
                  }, 
                  value: -4
                },
                {
                  text: {
                    shortenedText:"Didn't use the right language", 
                    fullText:"Didn't use the right language"
                  }, 
                  value: -1
                },
              ]
            },
            {
              name: "Interaction",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Missing screens of most important functions", 
                    fullText:"Missing screens of most important functions"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Emotional",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Missing emotional impact", 
                    fullText:"Missing emotional impact with users and bubbles"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Ecological",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Didn't show system fit in user's life", 
                    fullText:"Didn;t show system's fit in user's life and other system"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Bonus",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Detailed sketches", 
                    fullText:"Detailed sketches"
                  }, 
                  value: 3
                },
                {
                  text: {
                    shortenedText:"Correct affordances/metaphor use", 
                    fullText:"Correct affordances/metaphor use"
                  }, 
                  value: 2
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Storyboards and Scenario",
          ptsEarned: 20,
          ptsPossible: 20,
          criteria: [
            {
              name: "Scenario",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Not relevant to the designed system", 
                    fullText:"Not relevant to the designed system"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Storyboard",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Not meaningful storyboard from interaction perspective", 
                    fullText:"Not meaningful storyboard from interaction perspective"
                  }, 
                  value: -6
                },
                {
                  text: {
                    shortenedText:"Missing balloons, captions, and/or emotions", 
                    fullText:"Missing balloons, captions, and/or emotions"
                  }, 
                  value: -4
                },
              ]
            },
            {
              name: "Relevance",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Does not accurately address the scenario", 
                    fullText:"Does not accurately address the scenario"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Bonus",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Extra/detailed/well-documented storyboards", 
                    fullText:"Extra/detailed/well-documented storyboards"
                  }, 
                  value: 5
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Wireframes",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Right Format",
              ptsEarned: 2,
              ptsPossible: 2,
              comments: [
                {
                  text: {
                    shortenedText:"Not wireframes vs. visual comps", 
                    fullText:"Does not contrast wireframes vs. visual comps"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Connection to",
              ptsEarned: 2,
              ptsPossible: 2,
              comments: [
                {
                  text: {
                    shortenedText:"Wireframes don't address the scenario", 
                    fullText:"Wireframes don't address the scenario"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Quality",
              ptsEarned: 3,
              ptsPossible: 3,
              comments: [
                {
                  text: {
                    shortenedText:"Quality of wireframes", 
                    fullText:"Lost points for quality of wireframes"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Navigation",
              ptsEarned: 3,
              ptsPossible: 3,
              comments: [
                {
                  text: {
                    shortenedText:"Unclear navigation flow", 
                    fullText:"Unclear navigation flow, missing arrows/captions"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Bonus",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Digital, professional wireframes", 
                    fullText:"Digital, professional wireframes"
                  }, 
                  value: 3
                },
                {
                  text: {
                    shortenedText:"Excellent scenario", 
                    fullText:"Excellent scenario"
                  }, 
                  value: 2
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Documenting the Process",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Feedback",
              ptsEarned: 3,
              ptsPossible: 3,
              comments: [
                {
                  text: {
                    shortenedText:"Missing feedback from client", 
                    fullText:"Missing feedback from client"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Documenting",
              ptsEarned: 7,
              ptsPossible: 7,
              comments: [
                {
                  text: {
                    shortenedText:"Incomplete documentation", 
                    fullText:"Incomplete documentation on what you've done, textually, and with"
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Missing documentation on collaboration", 
                    fullText:"Missing documentation on collaboration"
                  }, 
                  value: -2
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Extra Effort",
          ptsEarned: 0,
          ptsPossible: 0,
          criteria: [
            {
              name: "Bonus",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Beyond expected work", 
                    fullText:"Included design Studio feedback, UX targets, constant checking with client, excellent discussion on learning, and physical mockup"
                  }, 
                  value: 5
                },
              ]
            },
          ],
          currComments: []
        },
      ],
      points: {ptsEarned: 100, ptsPossible: 100},
      //criteria: [],
      year: 2021,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      name: "Phase 3"
    }
    const phase4 = {
      template: [
        {
          name: "UX Targets",
          ptsEarned: 20,
          ptsPossible: 20,
          criteria: [
            {
              name: "Format",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Not appropriate format", 
                    fullText:"Appropriate format was not used"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Less than 5 rows", 
                    fullText:"Less than 5 rows"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Metrics",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Measures/metrics not appropriate", 
                    fullText:"Measures/metrics used for topic were not appropriate"
                  }, 
                  value: -10
                },
              ]
            },
            {
              name: "Rationale",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Inadaquate justification of choices", 
                    fullText:"Inadequate justification of choices"
                  }, 
                  value: -4
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Design Refinement",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Client or",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Did not meet client", 
                    fullText:"Did not meet client at beginning of phase"
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Did not use client feedback", 
                    fullText:"Did not refine design based on client feedback"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Our Feedback",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Did not use instructor/TA comments", 
                    fullText:"Did not take into account the instructor/TA comments"
                  }, 
                  value: -5
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Prototyping",
          ptsEarned: 30,
          ptsPossible: 30,
          criteria: [
            {
              name: "Rationale",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Poor justification of choice", 
                    fullText:"Poor justification of choice"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Quality",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Lost points for quality", 
                    fullText:"Lost points for quality/effort of prototype dev"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Evaluation",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Does not facilitate evaluation well", 
                    fullText:"The prototype is not effective in facilitating evaluation"
                  }, 
                  value: -5
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Evaluation",
          ptsEarned: 30,
          ptsPossible: 30,
          criteria: [
            {
              name: "UX Targets",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Did not include completed table", 
                    fullText:"Did not include completed table"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Evaluation plan is incomplete/lacking", 
                    fullText:"Evaluation plan is incomplete/lacking"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Participants",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Not enough participants", 
                    fullText:"Did not have 4-6 participants per work role (or 3-4 per user class)"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Participant demographics should reflect user class", 
                    fullText:"The participant demographics should reflect the user classes"
                  }, 
                  value: -3
                },
              ]
            },
            {
              name: "Procedure",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Tasks are not well thought out", 
                    fullText:"Tasks are not well thought out"
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"Goals are not clear", 
                    fullText:"Goals are not clear"
                  }, 
                  value: -3
                },
                {
                  text: {
                    shortenedText:"Should have no guidance", 
                    fullText:"Should have no guidance"
                  }, 
                  value: -2
                },
              ]
            },
            {
              name: "Analysis",
              ptsEarned: 10,
              ptsPossible: 10,
              comments: [
                {
                  text: {
                    shortenedText:"Missing charts/graphs", 
                    fullText:"Missing charts/graphs showing the data"
                  }, 
                  value: -5
                },
                {
                  text: {
                    shortenedText:"No baseline level comparison", 
                    fullText:"Missing comparisons with baseline levels"
                  }, 
                  value: -2
                },
                {
                  text: {
                    shortenedText:"Missing explanation", 
                    fullText:"Missing explanation"
                  }, 
                  value: -5
                },
              ]
            }
          ],
          currComments: []
        },
        {
          name: "Findings & Report",
          ptsEarned: 10,
          ptsPossible: 10,
          criteria: [
            {
              name: "Findings",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Finding discussions lacking", 
                    fullText:"Findings should discuss why you did not meet target levels and what went wrong"
                  }, 
                  value: -5
                },
              ]
            },
            {
              name: "Changes",
              ptsEarned: 5,
              ptsPossible: 5,
              comments: [
                {
                  text: {
                    shortenedText:"Missing recommendations", 
                    fullText:"Missing recommendations that would be made to the prototype to meet target levels"
                  }, 
                  value: -5
                },
              ]
            },
          ],
          currComments: []
        },
        {
          name: "Bonus Points",
          ptsEarned: 0,
          ptsPossible: 0,
          criteria: [
            {
              name: "Extra Effort",
              ptsEarned: 0,
              ptsPossible: 0,
              comments: [
                {
                  text: {
                    shortenedText:"Includes all bonus elements", 
                    fullText:"Includes limitations, +users, +analysis, +BTs, +eval, +prototypes"
                  }, 
                  value: 5
                },
              ]
            },
          ],
          currComments: []
        },
      ],
      points: {ptsEarned: 100, ptsPossible: 100},
      //criteria: [],
      year: 2021,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      name: "Phase 4"
    }
    const postReqs = []
    postReqs.push(postRubric(phase1))
    postReqs.push(postRubric(phase2))
    postReqs.push(postRubric(phase3))
    postReqs.push(postRubric(phase4))
    Promise.all(postReqs)
      .then((response) => {
        message.success("Made Rubrics");
      })
      .catch((error) => {
        message.error(error.message);
        console.log(error.response)
      });
  }

  submitAssignment = (values) => {
    console.log(values)
    getRubricByName(values.assignment_name)
      .then((response) => {
        const rubric_id = response.data.content[0].id
        const url = encodeURIComponent(values.url)
        const params = {
          encoded_url: url,
          group: ["Jack"],
          group_name: values.team_name,
          assignment_id: rubric_id,
          semester: values.semester,
        }
        postSubmission(params)
          .then((response) => {
            message.success("Submitted Assignment")
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
  }
  // ********* End of outdated Methods *********

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

  render() {
    return (
      <div
        style={{
          paddingLeft: "20px",
          paddingRight: "10px",
          paddingBottom: "20px",
        }}
      >
        <Divider orientation="left">Create Rubric</Divider>
        <Form
          colon={true}
          labelAlign="left"
          onFinish={this.submitAssignment}
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
          <div>
            <Form.List name="users">
              {(fields, { add, remove }) => {
                return (
                  <div
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      backgroundColor : "#9fe6e2",
                    }}
                  >
                    {fields.map(field => (
                      <>
                        <Divider>New Section</Divider>
                        <Space key={field.key} style={{ display: 'flex' }} align="start">
                          <Form.Item
                            {...field}
                            name={[field.name, 'first']}
                            fieldKey={[field.fieldKey, 'first']}
                            rules={[{ required: true, message: 'Missing section name' }]}
                          >
                            <Input placeholder="Section Name" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'last']}
                            fieldKey={[field.fieldKey, 'last']}
                            rules={[{ required: true, message: 'Missing last name' }]}
                          >
                            <InputNumber
                              size="medium"
                              placeholder="Points"
                            />
                          </Form.Item>

                          <MinusCircleOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </Space>
                        <div 
                          style={{
                            paddingLeft: "20px",
                            paddingRight: "10px",
                            backgroundColor:"#9ac8de"
                          }}
                        >
                          <Form.List name={[field.name, 'nicknames']}>
                            {(nicknames, { add, remove }) => {
                              return (
                                <div>
                                  {nicknames.map(nickname => (
                                    <>
                                      <Space key={nickname.key} style={{ display: 'flex' }} align="start">
                                        <Form.Item
                                          {...field}
                                          name={[field.name, 'first']}
                                          fieldKey={[field.fieldKey, 'first']}
                                          rules={[{ required: true, message: 'Missing section name' }]}
                                        >
                                          <Input placeholder="Criteria Name" />
                                        </Form.Item>
                                        <Form.Item
                                          {...field}
                                          name={[field.name, 'last']}
                                          fieldKey={[field.fieldKey, 'last']}
                                          rules={[{ required: true, message: 'Missing points' }]}
                                        >
                                          <InputNumber
                                            size="medium"
                                            placeholder="Points"
                                          />
                                        </Form.Item>

                                        <MinusCircleOutlined
                                          onClick={() => {
                                            remove(nickname.name);
                                          }}
                                        />
                                      </Space>
                                      <div 
                                        style={{
                                          paddingLeft: "30px",
                                          paddingRight: "10px",
                                          backgroundColor:"#638190"
                                        }}
                                      >
                                        <Form.List name={[field.name, 'nicknames']}>
                                          {(nicknames, { add, remove }) => {
                                            return (
                                              <div>
                                                {nicknames.map(nickname => (
                                                  <>
                                                    <Space key={nickname.key} style={{ display: 'flex' }} align="start">
                                                      <Form.Item
                                                        {...field}
                                                        name={[field.name, 'first']}
                                                        fieldKey={[field.fieldKey, 'first']}
                                                        rules={[{ required: true, message: 'Missing section name' }]}
                                                      >
                                                        <Input placeholder="Comment Text" />
                                                      </Form.Item>
                                                      <Form.Item
                                                        {...field}
                                                        name={[field.name, 'last']}
                                                        fieldKey={[field.fieldKey, 'last']}
                                                        rules={[{ required: true, message: 'Missing points' }]}
                                                      >
                                                        <InputNumber
                                                          size="medium"
                                                          placeholder="Points"
                                                        />
                                                      </Form.Item>

                                                      <MinusCircleOutlined
                                                        onClick={() => {
                                                          remove(nickname.name);
                                                        }}
                                                      />
                                                    </Space>
                                                  </>
                                                ))}

                                                <Form.Item>
                                                  <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                      add();
                                                    }}
                                                    block
                                                    style={{marginLeft:"10%",width:"80%"}}
                                                  >
                                                    <PlusOutlined /> Add Comment
                                                  </Button>
                                                </Form.Item>
                                              </div>
                                            );
                                          }}
                                        </Form.List>
                                      </div>
                                    </>
                                  ))}

                                  <Form.Item>
                                    <Button
                                      type="dashed"
                                      onClick={() => {
                                        add();
                                      }}
                                      block
                                      style={{marginLeft:"5%",width:"90%"}}
                                    >
                                      <PlusOutlined /> Add Criteria
                                    </Button>
                                  </Form.Item>
                                </div>
                              );
                            }}
                          </Form.List>
                        </div>
                      </>
                    ))}

                    <Form.Item>
                      <Button
                        type="solid"
                        onClick={() => {
                          add();
                        }}
                        block
                      >
                        <PlusOutlined /> Add Section
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>  
          </div>
          <Button htmlType="submit" type="primary">Submit</Button>
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