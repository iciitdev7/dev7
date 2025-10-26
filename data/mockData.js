export const mockAssessmentQuestions = [
  // Emotional Resilience to Rejection
  { 
    id: 1, 
    key: 'emotionalResilience1',
    textKey: 'assessmentQuestions.emotionalResilience1',
    optionsKey: 'assessmentOptions.emotionalResilience1',
    skill: "Emotional Resilience", 
    text: "How quickly do you bounce back after a client rejection?", 
    options: ["Immediately", "Within an hour", "Next day", "Days later"],
    scoreValues: [100, 75, 50, 25]
  },
  { 
    id: 2, 
    key: 'emotionalResilience2',
    textKey: 'assessmentQuestions.emotionalResilience2',
    optionsKey: 'assessmentOptions.emotionalResilience2',
    skill: "Emotional Resilience", 
    text: "When facing repeated 'no's, how do you feel?", 
    options: ["Motivated to improve", "Slightly discouraged", "Very frustrated", "Want to quit"],
    scoreValues: [100, 70, 40, 10]
  },
  { 
    id: 3, 
    key: 'emotionalResilience3',
    textKey: 'assessmentQuestions.emotionalResilience3',
    optionsKey: 'assessmentOptions.emotionalResilience3',
    skill: "Emotional Resilience", 
    text: "How do you handle criticism of your sales approach?", 
    options: ["Use it to improve", "Take it personally but recover", "Feel defensive", "Avoid feedback"],
    scoreValues: [100, 65, 35, 15]
  },

  // Energy and Focus Management
  { 
    id: 4, 
    key: 'energyFocus1',
    textKey: 'assessmentQuestions.energyFocus1',
    optionsKey: 'assessmentOptions.energyFocus1',
    skill: "Energy and Focus", 
    text: "How often do you feel mentally drained during the workday?", 
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
    scoreValues: [100, 70, 40, 15]
  },
  { 
    id: 5, 
    key: 'energyFocus2',
    textKey: 'assessmentQuestions.energyFocus2',
    optionsKey: 'assessmentOptions.energyFocus2',
    skill: "Energy and Focus", 
    text: "How well can you concentrate during important calls?", 
    options: ["Fully focused", "Mostly focused", "Sometimes distracted", "Often distracted"],
    scoreValues: [100, 75, 45, 20]
  },
  { 
    id: 6, 
    key: 'energyFocus3',
    textKey: 'assessmentQuestions.energyFocus3',
    optionsKey: 'assessmentOptions.energyFocus3',
    skill: "Energy and Focus", 
    text: "How do you maintain energy throughout long sales days?", 
    options: ["Natural high energy", "Take strategic breaks", "Push through fatigue", "Struggle with fatigue"],
    scoreValues: [100, 80, 50, 25]
  },

  // Confidence Building
  { 
    id: 7, 
    key: 'confidence1',
    textKey: 'assessmentQuestions.confidence1',
    optionsKey: 'assessmentOptions.confidence1',
    skill: "Confidence Building", 
    text: "How confident do you feel when approaching new prospects?", 
    options: ["Very confident", "Somewhat confident", "Nervous but manage", "Very anxious"],
    scoreValues: [100, 70, 45, 20]
  },
  { 
    id: 8, 
    key: 'confidence2',
    textKey: 'assessmentQuestions.confidence2',
    optionsKey: 'assessmentOptions.confidence2',
    skill: "Confidence Building", 
    text: "How do you feel about your sales abilities?", 
    options: ["Strong and improving", "Good with room to grow", "Adequate but doubting", "Lack confidence"],
    scoreValues: [100, 75, 40, 15]
  },

  // Stress and Anxiety Management
  { 
    id: 9, 
    key: 'stress1',
    textKey: 'assessmentQuestions.stress1',
    optionsKey: 'assessmentOptions.stress1',
    skill: "Stress Management", 
    text: "How do you handle high-pressure sales situations?", 
    options: ["Thrive under pressure", "Manage well", "Get somewhat anxious", "Feel overwhelmed"],
    scoreValues: [100, 75, 45, 20]
  },
  { 
    id: 10, 
    key: 'stress2',
    textKey: 'assessmentQuestions.stress2',
    optionsKey: 'assessmentOptions.stress2',
    skill: "Stress Management", 
    text: "How often do you experience sales-related anxiety?", 
    options: ["Never", "Rarely", "Sometimes", "Frequently"],
    scoreValues: [100, 80, 50, 25]
  },

  // Motivation and Goal Setting
  { 
    id: 11, 
    key: 'motivation1',
    textKey: 'assessmentQuestions.motivation1',
    optionsKey: 'assessmentOptions.motivation1',
    skill: "Motivation", 
    text: "How motivated are you to achieve your sales targets?", 
    options: ["Extremely motivated", "Very motivated", "Somewhat motivated", "Struggling with motivation"],
    scoreValues: [100, 80, 50, 25]
  },
  { 
    id: 12, 
    key: 'motivation2',
    textKey: 'assessmentQuestions.motivation2',
    optionsKey: 'assessmentOptions.motivation2',
    skill: "Motivation", 
    text: "How clear are you about your career goals?", 
    options: ["Very clear path", "Generally clear", "Somewhat unclear", "Very unclear"],
    scoreValues: [100, 75, 45, 20]
  },

  // Communication Skills
  { 
    id: 13, 
    key: 'communication1',
    textKey: 'assessmentQuestions.communication1',
    optionsKey: 'assessmentOptions.communication1',
    skill: "Communication", 
    text: "How comfortable are you with difficult conversations?", 
    options: ["Very comfortable", "Mostly comfortable", "Somewhat uncomfortable", "Very uncomfortable"],
    scoreValues: [100, 75, 45, 20]
  },
  { 
    id: 14, 
    key: 'communication2',
    textKey: 'assessmentQuestions.communication2',
    optionsKey: 'assessmentOptions.communication2',
    skill: "Communication", 
    text: "How well do you listen to customer needs?", 
    options: ["Excellent listener", "Good listener", "Average listener", "Need improvement"],
    scoreValues: [100, 80, 55, 30]
  },

  // Time Management
  { 
    id: 15, 
    key: 'timeManagement1',
    textKey: 'assessmentQuestions.timeManagement1',
    optionsKey: 'assessmentOptions.timeManagement1',
    skill: "Time Management", 
    text: "How well do you prioritize your daily tasks?", 
    options: ["Very organized", "Mostly organized", "Somewhat scattered", "Very disorganized"],
    scoreValues: [100, 75, 45, 20]
  },
  { 
    id: 16, 
    key: 'timeManagement2',
    textKey: 'assessmentQuestions.timeManagement2',
    optionsKey: 'assessmentOptions.timeManagement2',
    skill: "Time Management", 
    text: "How often do you meet your deadlines?", 
    options: ["Always", "Usually", "Sometimes", "Rarely"],
    scoreValues: [100, 80, 50, 25]
  },

  // Relationship Building
  { 
    id: 17, 
    key: 'relationships1',
    textKey: 'assessmentQuestions.relationships1',
    optionsKey: 'assessmentOptions.relationships1',
    skill: "Relationship Building", 
    text: "How easily do you build rapport with new clients?", 
    options: ["Very easily", "Fairly easily", "With some effort", "With great difficulty"],
    scoreValues: [100, 75, 50, 25]
  },
  { 
    id: 18, 
    key: 'relationships2',
    textKey: 'assessmentQuestions.relationships2',
    optionsKey: 'assessmentOptions.relationships2',
    skill: "Relationship Building", 
    text: "How well do you maintain long-term client relationships?", 
    options: ["Excellent", "Good", "Fair", "Poor"],
    scoreValues: [100, 80, 55, 30]
  },

  // Adaptability
  { 
    id: 19, 
    key: 'adaptability1',
    textKey: 'assessmentQuestions.adaptability1',
    optionsKey: 'assessmentOptions.adaptability1',
    skill: "Adaptability", 
    text: "How well do you adjust to changing market conditions?", 
    options: ["Very adaptable", "Mostly adaptable", "Somewhat rigid", "Very rigid"],
    scoreValues: [100, 75, 45, 20]
  },
  { 
    id: 20, 
    key: 'adaptability2',
    textKey: 'assessmentQuestions.adaptability2',
    optionsKey: 'assessmentOptions.adaptability2',
    skill: "Adaptability", 
    text: "How do you handle unexpected changes in your sales process?", 
    options: ["Embrace change", "Adapt quickly", "Need time to adjust", "Resist change"],
    scoreValues: [100, 80, 50, 25]
  },

  // Problem-Solving
  { 
    id: 21, 
    key: 'problemSolving1',
    textKey: 'assessmentQuestions.problemSolving1',
    optionsKey: 'assessmentOptions.problemSolving1',
    skill: "Problem-Solving", 
    text: "How do you approach complex client problems?", 
    options: ["Systematic approach", "Intuitive problem-solving", "Ask for help", "Feel overwhelmed"],
    scoreValues: [100, 75, 50, 25]
  },
  { 
    id: 22, 
    key: 'problemSolving2',
    textKey: 'assessmentQuestions.problemSolving2',
    optionsKey: 'assessmentOptions.problemSolving2',
    skill: "Problem-Solving", 
    text: "How confident are you in finding creative solutions?", 
    options: ["Very confident", "Somewhat confident", "Not very confident", "Lack confidence"],
    scoreValues: [100, 70, 40, 15]
  },
  // Empathy and Active Listening
  { 
    id: 23, 
    key: 'empathy1',
    textKey: 'assessmentQuestions.empathy1',
    optionsKey: 'assessmentOptions.empathy1',
    skill: "Empathy and Active Listening", 
    text: "How well do you understand your clients' underlying concerns?", 
    options: ["Always pick up on emotions", "Usually understand concerns", "Sometimes miss cues", "Often misunderstand needs"],
    scoreValues: [100, 75, 45, 20]
  },
  { 
    id: 24, 
    key: 'empathy2',
    textKey: 'assessmentQuestions.empathy2',
    optionsKey: 'assessmentOptions.empathy2',
    skill: "Empathy and Active Listening", 
    text: "How often do you reflect back what clients say?", 
    options: ["Always paraphrase", "Often reflect", "Sometimes summarize", "Rarely reflect back"],
    scoreValues: [100, 80, 50, 25]
  },
  { 
    id: 25, 
    key: 'empathy3',
    textKey: 'assessmentQuestions.empathy3',
    optionsKey: 'assessmentOptions.empathy3',
    skill: "Empathy and Active Listening", 
    text: "How comfortable are you with emotional conversations?", 
    options: ["Very comfortable", "Mostly comfortable", "Somewhat uncomfortable", "Very uncomfortable"],
    scoreValues: [100, 75, 45, 20]
  }
];

export const mockSkills = [
  {
    id: "emotional-resilience",
    name: "Emotional Resilience to Rejection",
    shortName: "Emotional Resilience",
    description: "Build mental toughness to bounce back quickly from rejection and maintain motivation.",
    icon: "🛡️",
    score: 72,
    methodologies: ["Cognitive Behavioral Therapy (CBT)", "Self-compassion techniques", "Cognitive reappraisal"],
    drills: [
      { 
        id: "abc-card", 
        title: "ABC Card Analysis", 
        type: "form", 
        component: "AbcCardDrill",
        description: "Identify and challenge negative thought patterns after rejection",
        duration: "5-10 minutes"
      },
      { 
        id: "90-sec-reset", 
        title: "90-Second Reset", 
        type: "timer", 
        component: "BreathingTimerDrill",
        description: "Quick breathing exercise to reset your emotional state",
        duration: "90 seconds"
      },
      { 
        id: "3-kind-facts", 
        title: "Three Kind Facts", 
        type: "form", 
        component: "ThreeFactsDrill",
        description: "Practice self-compassion by listing positive truths about yourself",
        duration: "3-5 minutes"
      },
    ],
  },
  {
    id: "energy-focus",
    name: "Energy and Focus Management",
    shortName: "Energy & Focus",
    description: "Optimize your mental energy and maintain sharp focus throughout long sales days.",
    icon: "⚡",
    score: 68,
    methodologies: ["Mindfulness techniques", "Energy management", "Attention training"],
    drills: [
      { 
        id: "energy-audit", 
        title: "Daily Energy Audit", 
        type: "form", 
        component: "EnergyAuditDrill",
        description: "Track your energy patterns and identify optimization opportunities",
        duration: "5 minutes"
      },
      { 
        id: "focus-timer", 
        title: "Deep Focus Timer", 
        type: "timer", 
        component: "FocusTimerDrill",
        description: "25-minute focused work session with guided breaks",
        duration: "25 minutes"
      },
      { 
        id: "mindful-transition", 
        title: "Mindful Transitions", 
        type: "form", 
        component: "TransitionDrill",
        description: "Create intentional breaks between activities to maintain focus",
        duration: "2 minutes"
      },
    ],
  },
  {
    id: "confidence-building",
    name: "Confidence Building",
    shortName: "Confidence",
    description: "Develop unshakeable self-confidence and positive self-talk for sales success.",
    icon: "💪",
    score: 45, // Lowest score - will be highlighted
    methodologies: ["Positive psychology", "Self-efficacy training", "Affirmation practices"],
    drills: [
      { 
        id: "success-inventory", 
        title: "Success Inventory", 
        type: "form", 
        component: "SuccessInventoryDrill",
        description: "Document and celebrate your past wins to build confidence",
        duration: "10 minutes"
      },
      { 
        id: "power-pose", 
        title: "Power Pose Session", 
        type: "timer", 
        component: "PowerPoseDrill",
        description: "2-minute confidence-building posture exercise",
        duration: "2 minutes"
      },
      { 
        id: "positive-affirmations", 
        title: "Daily Affirmations", 
        type: "form", 
        component: "AffirmationsDrill",
        description: "Create and practice personalized positive affirmations",
        duration: "5 minutes"
      },
    ],
  },
  {
    id: "stress-management",
    name: "Stress and Anxiety Management",
    shortName: "Stress Management",
    description: "Learn proven techniques to manage stress and anxiety in high-pressure situations.",
    icon: "🧘",
    score: 75,
    methodologies: ["Progressive muscle relaxation", "Breathing techniques", "Mindfulness meditation"],
    drills: [
      { 
        id: "stress-thermometer", 
        title: "Stress Thermometer", 
        type: "form", 
        component: "StressThermometerDrill",
        description: "Assess and track your current stress levels",
        duration: "3 minutes"
      },
      { 
        id: "box-breathing", 
        title: "Box Breathing", 
        type: "timer", 
        component: "BoxBreathingDrill",
        description: "4-4-4-4 breathing pattern for immediate stress relief",
        duration: "5 minutes"
      },
      { 
        id: "worry-time", 
        title: "Worry Time Planning", 
        type: "form", 
        component: "WorryTimeDrill",
        description: "Schedule dedicated time for processing worries and concerns",
        duration: "10 minutes"
      },
    ],
  },
  {
    id: "motivation-goals",
    name: "Motivation and Goal Setting",
    shortName: "Motivation",
    description: "Set meaningful goals and maintain high motivation levels for sustained performance.",
    icon: "🎯",
    score: 82,
    methodologies: ["Goal setting theory", "Intrinsic motivation", "Progress tracking"],
    drills: [
      { 
        id: "smart-goals", 
        title: "SMART Goals Workshop", 
        type: "form", 
        component: "SmartGoalsDrill",
        description: "Create specific, measurable, achievable, relevant, time-bound goals",
        duration: "15 minutes"
      },
      { 
        id: "motivation-check", 
        title: "Motivation Check-in", 
        type: "form", 
        component: "MotivationCheckDrill",
        description: "Daily assessment of motivation levels and drivers",
        duration: "5 minutes"
      },
      { 
        id: "vision-board", 
        title: "Digital Vision Board", 
        type: "form", 
        component: "VisionBoardDrill",
        description: "Create a visual representation of your goals and aspirations",
        duration: "20 minutes"
      },
    ],
  },
  {
    id: "communication-skills",
    name: "Communication Skills",
    shortName: "Communication",
    description: "Enhance your verbal and non-verbal communication for better client connections.",
    icon: "💬",
    score: 78,
    methodologies: ["Active listening", "Nonviolent communication", "Storytelling techniques"],
    drills: [
      { 
        id: "active-listening", 
        title: "Active Listening Practice", 
        type: "form", 
        component: "ActiveListeningDrill",
        description: "Practice and evaluate your listening skills",
        duration: "10 minutes"
      },
      { 
        id: "elevator-pitch", 
        title: "Elevator Pitch Builder", 
        type: "form", 
        component: "ElevatorPitchDrill",
        description: "Craft and refine your personal elevator pitch",
        duration: "15 minutes"
      },
      { 
        id: "empathy-mapping", 
        title: "Client Empathy Mapping", 
        type: "form", 
        component: "EmpathyMappingDrill",
        description: "Understand your client's perspective and emotions",
        duration: "10 minutes"
      },
    ],
  },
  {
    id: "time-management",
    name: "Time Management and Productivity",
    shortName: "Time Management",
    description: "Optimize your schedule and increase productivity with proven time management strategies.",
    icon: "⏰",
    score: 65,
    methodologies: ["Time blocking", "Pomodoro technique", "Priority matrix"],
    drills: [
      { 
        id: "time-audit", 
        title: "Weekly Time Audit", 
        type: "form", 
        component: "TimeAuditDrill",
        description: "Analyze how you spend your time and identify improvements",
        duration: "20 minutes"
      },
      { 
        id: "priority-matrix", 
        title: "Priority Matrix", 
        type: "form", 
        component: "PriorityMatrixDrill",
        description: "Categorize tasks by urgency and importance",
        duration: "10 minutes"
      },
      { 
        id: "pomodoro-session", 
        title: "Pomodoro Focus Session", 
        type: "timer", 
        component: "PomodoroTimerDrill",
        description: "25-minute focused work session with 5-minute break",
        duration: "30 minutes"
      },
    ],
  },
  {
    id: "relationship-building",
    name: "Relationship Building",
    shortName: "Relationships",
    description: "Develop authentic, long-lasting relationships with clients and colleagues.",
    icon: "🤝",
    score: 71,
    methodologies: ["Relationship mapping", "Trust building", "Network development"],
    drills: [
      { 
        id: "relationship-map", 
        title: "Client Relationship Mapping", 
        type: "form", 
        component: "RelationshipMapDrill",
        description: "Map and strengthen key client relationships",
        duration: "15 minutes"
      },
      { 
        id: "gratitude-messages", 
        title: "Gratitude Message Practice", 
        type: "form", 
        component: "GratitudeDrill",
        description: "Craft meaningful thank you messages for clients",
        duration: "10 minutes"
      },
      { 
        id: "follow-up-tracker", 
        title: "Follow-up Tracker", 
        type: "form", 
        component: "FollowUpDrill",
        description: "Plan and track client follow-up communications",
        duration: "5 minutes"
      },
    ],
  },
  {
    id: "adaptability",
    name: "Adaptability and Change Management",
    shortName: "Adaptability",
    description: "Develop flexibility and resilience to thrive in changing business environments.",
    icon: "🔄",
    score: 69,
    methodologies: ["Change management", "Flexibility training", "Growth mindset"],
    drills: [
      { 
        id: "change-readiness", 
        title: "Change Readiness Assessment", 
        type: "form", 
        component: "ChangeReadinessDrill",
        description: "Evaluate your readiness to adapt to changes",
        duration: "10 minutes"
      },
      { 
        id: "flexibility-challenge", 
        title: "Daily Flexibility Challenge", 
        type: "form", 
        component: "FlexibilityDrill",
        description: "Practice adapting to small daily changes",
        duration: "5 minutes"
      },
      { 
        id: "scenario-planning", 
        title: "Scenario Planning", 
        type: "form", 
        component: "ScenarioPlanningDrill",
        description: "Prepare for different potential outcomes",
        duration: "20 minutes"
      },
    ],
  },
  {
    id: "problem-solving",
    name: "Creative Problem-Solving",
    shortName: "Problem-Solving",
    description: "Enhance your ability to find innovative solutions to complex sales challenges.",
    icon: "🧩",
    score: 73,
    methodologies: ["Design thinking", "Creative brainstorming", "Systematic analysis"],
    drills: [
      { 
        id: "problem-definition", 
        title: "Problem Definition Workshop", 
        type: "form", 
        component: "ProblemDefinitionDrill",
        description: "Clearly define and analyze complex problems",
        duration: "15 minutes"
      },
      { 
        id: "creative-alternatives", 
        title: "Creative Alternatives", 
        type: "form", 
        component: "CreativeAlternativesDrill",
        description: "Generate multiple creative solutions to challenges",
        duration: "10 minutes"
      },
      { 
        id: "solution-testing", 
        title: "Solution Testing Framework", 
        type: "form", 
        component: "SolutionTestingDrill",
        description: "Evaluate and test potential solutions systematically",
        duration: "12 minutes"
      },
    ],
  },
  {
    id: "flexible-thinking",
    name: "Flexible Thinking",
    shortName: "Flexible Thinking",
    description: "Overcome rigid thinking patterns and avoid being stuck in single scripts.",
    icon: "🧠",
    score: 71,
    methodologies: ["CBT-based cognitive reevaluation", "SCAMPER creative problem solving", "Reframing perspectives"],
    drills: [
      { 
        id: "three-alternatives", 
        title: "Three Alternatives to Objections", 
        type: "form", 
        component: "ThreeAlternativesDrill",
        description: "Devise three creative responses to address common pricing concerns",
        duration: "10-15 minutes"
      },
      { 
        id: "what-if-scenarios", 
        title: "What If... Scenario Cards", 
        type: "interactive", 
        component: "WhatIfScenariosDrill",
        description: "Practice adapting your approach when context changes unexpectedly",
        duration: "8-12 minutes"
      },
      { 
        id: "perspective-reframe", 
        title: "Perspective Reframing", 
        type: "form", 
        component: "PerspectiveReframeDrill",
        description: "Challenge rigid thinking by exploring multiple viewpoints",
        duration: "7-10 minutes"
      },
    ],
  },
  {
    id: "empathy-active-listening",
    name: "Empathy and Active Listening",
    shortName: "Empathy & Listening",
    description: "Build trust and enhance discovery-meeting conversions through deep understanding.",
    icon: "👂",
    score: 67,
    methodologies: ["Motivational Interviewing (MI)", "OARS technique", "Emotional labeling"],
    drills: [
      { 
        id: "roleplay-dialogue", 
        title: "AI Client Roleplay", 
        type: "interactive", 
        component: "RoleplayDialogueDrill",
        description: "Practice achieving three reflections within two minutes with an AI client",
        duration: "2-5 minutes"
      },
      { 
        id: "summary-30", 
        title: "Summary-30 Challenge", 
        type: "timer", 
        component: "Summary30Drill",
        description: "Recap main conversation points in thirty seconds",
        duration: "30 seconds"
      },
      { 
        id: "emotional-labeling", 
        title: "Emotional Labeling Practice", 
        type: "form", 
        component: "EmotionalLabelingDrill",
        description: "Identify and label emotions in client scenarios",
        duration: "5-8 minutes"
      },
    ],
  },
  {
    id: "anxiety-management",
    name: "Anxiety Management Before Calls",
    shortName: "Anxiety Management",
    description: "Decrease avoidance behavior and encourage early outreach efforts through proven anxiety management techniques.",
    icon: "🧘‍♂️",
    score: 58,
    methodologies: ["Imaginal exposure therapy", "STOP skill (Stop-Take Breathe-Observe-Proceed)", "WOOP goal setting"],
    drills: [
      { 
        id: "micro-exposure", 
        title: "Micro-Exposure", 
        type: "interactive", 
        component: "MicroExposureDrill",
        description: "Mentally rehearse the first 20 seconds of a call three times",
        duration: "5-8 minutes"
      },
      { 
        id: "woop-exercise", 
        title: "WOOP Exercise", 
        type: "form", 
        component: "WoopExerciseDrill",
        description: "Plan your first call of the day using WOOP method",
        duration: "10-15 minutes"
      },
    ],
  },
  {
    id: "handling-objections",
    name: "Handling Objections",
    shortName: "Handling Objections",
    description: "Accelerate transitions to next steps while maintaining objection-handling efficiency.",
    icon: "🛡️",
    score: 63,
    methodologies: ["Feel-Understand-Discuss scripts", "Cognitive frameworks", "Behavioral experiments"],
    drills: [
      { 
        id: "five-fast-cards", 
        title: "Five Fast Cards", 
        type: "interactive", 
        component: "FiveFastCardsDrill",
        description: "Address common objections: Expensive/No Time/Already Have Solution",
        duration: "8-12 minutes"
      },
      { 
        id: "next-steps-experiment", 
        title: "Next Steps Experiment", 
        type: "tracking", 
        component: "NextStepsExperimentDrill",
        description: "Ask for next steps five times daily and track conversion results",
        duration: "5-10 minutes"
      },
    ],
  },
  {
    id: "goal-setting-motivation",
    name: "Goal Setting and Motivation",
    shortName: "Goal Setting",
    description: "Maintain focus on leading metrics through structured goal setting and motivation techniques.",
    icon: "🎯",
    score: 74,
    methodologies: ["OKR/SMART for sales objectives", "Self-Determination Theory", "Gratitude and success review practices"],
    drills: [
      { 
        id: "one-outcome-three-actions", 
        title: "One Outcome + Three Leading Actions Per Day", 
        type: "form", 
        component: "OneOutcomeThreeActionsDrill",
        description: "Define one key outcome and three specific actions to achieve it daily",
        duration: "5-8 minutes"
      },
      { 
        id: "sixty-second-mini-retro", 
        title: "Sixty Second Mini-Retro of Achievements", 
        type: "timer", 
        component: "SixtySecondRetroDrill",
        description: "Quick reflection on daily achievements and learnings",
        duration: "60 seconds"
      },
    ],
  },
];

// Mock progress data
export const mockProgressData = {
  totalDrillsCompleted: 23,
  currentStreak: 5,
  weeklyGoal: 10,
  weeklyProgress: [
    { day: 'Mon', completed: 3 },
    { day: 'Tue', completed: 2 },
    { day: 'Wed', completed: 4 },
    { day: 'Thu', completed: 1 },
    { day: 'Fri', completed: 3 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 1 },
  ],
  skillProgress: [
    { skill: 'Confidence', improvement: 25 },
    { skill: 'Resilience', improvement: 18 },
    { skill: 'Focus', improvement: 22 },
    { skill: 'Communication', improvement: 15 },
    { skill: 'Stress Mgmt', improvement: 20 },
  ],
  recentActivities: [
    { date: '2025-01-29', activity: 'ABC Card Analysis', skill: 'Emotional Resilience', duration: '8 min' },
    { date: '2025-01-29', activity: '90-Second Reset', skill: 'Emotional Resilience', duration: '90 sec' },
    { date: '2025-01-28', activity: 'Success Inventory', skill: 'Confidence Building', duration: '12 min' },
    { date: '2025-01-28', activity: 'Deep Focus Timer', skill: 'Energy & Focus', duration: '25 min' },
    { date: '2025-01-27', activity: 'Box Breathing', skill: 'Stress Management', duration: '5 min' },
  ]
};

// Russian translations
const ru = {
  // Navigation and Common
  home: 'Главная',
  dashboard: 'Панель управления',
  progress: 'Прогресс',
  assessment: 'Оценка',
  skills: 'Навыки',
  back: 'Назад',
  next: 'Далее',
  previous: 'Предыдущий',
  complete: 'Завершить',
  start: 'Начать',
  submit: 'Отправить',
  cancel: 'Отмена',
  loading: 'Загрузка...',
  
  // Home Page
  appName: 'SalesMind',
  tagline: 'Ментальное здоровье для команд продаж',
  heroTitle: 'Трансформируйте свои продажи с помощью ментальной подготовки',
  heroDescription: 'Овладейте эмоциональной устойчивостью, создайте непоколебимую уверенность и развейте ментальные инструменты для успеха в условиях высокого давления. Начните свой персонализированный путь сегодня.',
  takeAssessment: 'Пройти оценку',
  goToDashboard: 'Перейти к панели',
  viewDemo: 'Посмотреть демо',
  everythingYouNeed: 'Всё что вам нужно для успеха',
  comprehensiveTools: 'Комплексные инструменты ментального здоровья, разработанные специально для профессионалов продаж',
  
  // Features
  mentalResilienceTitle: 'Тренировка ментальной устойчивости',
  mentalResilienceDesc: 'Развивайте эмоциональную силу, чтобы быстро восстанавливаться после отказов и поддерживать пиковую производительность.',
  personalizedSkillTitle: 'Персонализированное развитие навыков',
  personalizedSkillDesc: 'Пройдите комплексную оценку и получите индивидуальные рекомендации по обучению.',
  progressTrackingTitle: 'Отслеживание прогресса',
  progressTrackingDesc: 'Отслеживайте свои улучшения с помощью детальной аналитики и визуализации прогресса.',
  salesSpecificTitle: 'Инструменты для продаж',
  salesSpecificDesc: 'Получите доступ к упражнениям, разработанным специально для профессионалов продаж.',
  
  // Stats
  coreSkills: 'Основных ментальных навыков',
  interactiveDrills: 'Интерактивных упражнений',
  averageSession: 'Средняя сессия',
  
  // Footer
  footerTagline: 'Расширяем возможности профессионалов продаж с помощью инструментов ментального здоровья для достижения пиковой производительности.',
  
  // Assessment
  assessmentTitle: 'Оценка SalesMind',
  questionOf: 'Вопрос {current} из {total}',
  progressLabel: 'Прогресс',
  completeAssessment: 'Завершить оценку',
  
  // Dashboard
  welcomeBack: 'С возвращением, {name}! 👋',
  readyToBoost: 'Готовы повысить свою эффективность продаж с помощью целенаправленной ментальной подготовки?',
  overallScore: 'Общий балл',
  drillsCompleted: 'Упражнений выполнено',
  currentStreak: 'Текущая серия',
  timeInvested: 'Время вложено',
  consecutiveDays: 'Дней подряд',
  thisWeek: 'На этой неделе',
  priorityFocusArea: 'Приоритетная область фокуса',
  recommendedBased: 'На основе вашей оценки мы рекомендуем сначала сосредоточиться на этом навыке',
  recommended: 'Рекомендуется',
  startTraining: 'Начать тренировку',
  allMentalSkills: 'Все ментальные навыки',
  skillsAvailable: '{count} навыков доступно',
  exercises: 'упражнений',
  recentActivity: 'Недавняя активность',
  justCompleted: 'Только что завершено',
  
  // Skills
  currentProgress: 'Текущий прогресс',
  basedOn: 'Основано на:',
  trainingExercises: 'Тренировочные упражнения',
  exercisesAvailable: '{count} упражнений доступно',
  startExercise: 'Начать упражнение',
  completed: 'Завершено',
  
  // Progress
  myProgress: 'Мой прогресс',
  totalCompleted: 'Всего завершено',
  allTimeDrills: 'Упражнений за всё время',
  weeklyGoal: 'Недельная цель',
  weeklyActivity: 'Недельная активность',
  dailyDrillCompletions: 'Ваши ежедневные завершения упражнений на этой неделе',
  skillImprovements: 'Улучшения навыков',
  pointIncreases: 'Увеличение баллов по областям навыков',
  recentActivities: 'Недавняя активность',
  latestCompleted: 'Ваши последние завершенные упражнения',
  
  // Skill Names
  emotionalResilience: 'Эмоциональная устойчивость к отказам',
  energyFocus: 'Управление энергией и фокусом',
  confidenceBuilding: 'Построение уверенности',
  stressManagement: 'Управление стрессом и тревогой',
  motivation: 'Мотивация и постановка целей',
  communication: 'Навыки коммуникации',
  timeManagement: 'Управление временем и продуктивность',
  relationshipBuilding: 'Построение отношений',
  adaptability: 'Адаптивность и управление изменениями',
  problemSolving: 'Творческое решение проблем',
  flexibleThinking: 'Гибкое мышление',
  empathyListening: 'Эмпатия и активное слушание',
  anxietyManagement: 'Управление тревогой перед звонками',
  
  // Skill Descriptions
  emotionalResilienceDesc: 'Развивайте ментальную стойкость, чтобы быстро восстанавливаться после отказов и поддерживать мотивацию.',
  energyFocusDesc: 'Оптимизируйте свою ментальную энергию и поддерживайте острый фокус в течение долгих рабочих дней.',
  confidenceBuildingDesc: 'Развивайте непоколебимую уверенность в себе и позитивный внутренний диалог для успеха в продажах.',
  stressManagementDesc: 'Изучите проверенные техники управления стрессом и тревогой в ситуациях высокого давления.',
  motivationDesc: 'Ставьте значимые цели и поддерживайте высокий уровень мотивации для устойчивой производительности.',
  communicationDesc: 'Улучшите свою вербальную и невербальную коммуникацию для лучших связей с клиентами.',
  timeManagementDesc: 'Оптимизируйте свой график и повысьте продуктивность с помощью проверенных стратегий управления временем.',
  relationshipBuildingDesc: 'Развивайте аутентичные, долгосрочные отношения с клиентами и коллегами.',
  adaptabilityDesc: 'Развивайте гибкость и устойчивость для процветания в изменяющейся бизнес-среде.',
  problemSolvingDesc: 'Улучшите свою способность находить инновационные решения сложных задач продаж.',
  flexibleThinkingDesc: 'Преодолевайте жесткие паттерны мышления и избегайте застревания в одних сценариях.',
  empathyListeningDesc: 'Создавайте доверие и улучшайте конверсию встреч через глубокое понимание.',
  anxietyManagementDesc: 'Уменьшайте избегающее поведение и поощряйте ранние усилия по установлению контактов.',
  
  // Drill Names and Descriptions
  abcCardAnalysis: 'Анализ ABC-карты',
  abcCardDesc: 'Выявляйте и оспаривайте негативные паттерны мышления после отказов',
  ninetySecondReset: '90-секундная перезагрузка',
  ninetySecondResetDesc: 'Быстрое дыхательное упражнение для сброса эмоционального состояния',
  threeKindFacts: 'Три добрых факта',
  threeKindFactsDesc: 'Практикуйте самосострадание, перечисляя позитивные истины о себе',
  roleplayDialogue: 'Ролевая игра с ИИ-клиентом',
  roleplayDialogueDesc: 'Практикуйте достижение трех отражений за две минуты с ИИ-клиентом',
  summary30: 'Вызов "Резюме-30"',
  summary30Desc: 'Резюмируйте основные моменты разговора за тридцать секунд',
  emotionalLabeling: 'Практика эмоциональной маркировки',
  emotionalLabelingDesc: 'Определяйте и маркируйте эмоции в сценариях с клиентами',
  threeAlternatives: 'Три альтернативы возражениям',
  threeAlternativesDesc: 'Разработайте три креативных ответа на общие ценовые возражения',
  whatIfScenarios: 'Карты сценариев "Что если..."',
  whatIfScenariosDesc: 'Практикуйте адаптацию подхода при неожиданных изменениях контекста',
  perspectiveReframe: 'Переосмысление перспективы',
  perspectiveReframeDesc: 'Оспаривайте жесткое мышление, исследуя множественные точки зрения',
  microExposure: 'Микро-экспозиция',
  microExposureDesc: 'Мысленно репетируйте первые 20 секунд звонка три раза',
  woopExercise: 'Упражнение WOOP',
  woopExerciseDesc: 'Планирование первого звонка дня с помощью метода WOOP',
  
  // Common Drill Elements
  duration: 'Продолжительность',
  minutes: 'минут',
  seconds: 'секунд',
  timeRemaining: 'Осталось времени',
  timeUsed: 'Использовано времени',
  score: 'Балл',
  accuracy: 'Точность',
  scenarios: 'Сценарии',
  reflections: 'Отражения',
  alternatives: 'Альтернативы',
  adaptations: 'Адаптации',
  rehearsals: 'Репетиции',
  
  // Assessment Questions
  assessmentQuestions: {
    emotionalResilience1: 'Как быстро вы восстанавливаетесь после отказа клиента?',
    emotionalResilience2: 'Когда сталкиваетесь с повторными "нет", как вы себя чувствуете?',
    emotionalResilience3: 'Как вы справляетесь с критикой вашего подхода к продажам?',
    energyFocus1: 'Как часто вы чувствуете ментальное истощение в течение рабочего дня?',
    energyFocus2: 'Насколько хорошо вы можете концентрироваться во время важных звонков?',
    energyFocus3: 'Как вы поддерживаете энергию в течение долгих рабочих дней?',
    confidence1: 'Насколько уверенно вы себя чувствуете при обращении к новым потенциальным клиентам?',
    confidence2: 'Как вы оцениваете свои способности в продажах?',
    stress1: 'Как вы справляетесь с ситуациями высокого давления в продажах?',
    stress2: 'Как часто вы испытываете тревогу, связанную с продажами?',
    motivation1: 'Насколько вы мотивированы достигать своих целей продаж?',
    motivation2: 'Насколько четко вы представляете свои карьерные цели?',
    communication1: 'Насколько комфортно вам ведение сложных разговоров?',
    communication2: 'Насколько хорошо вы слушаете потребности клиентов?',
    timeManagement1: 'Насколько хорошо вы расставляете приоритеты в ежедневных задачах?',
    timeManagement2: 'Как часто вы соблюдаете свои дедлайны?',
    relationships1: 'Насколько легко вы устанавливаете контакт с новыми клиентами?',
    relationships2: 'Насколько хорошо вы поддерживаете долгосрочные отношения с клиентами?',
    adaptability1: 'Насколько хорошо вы адаптируетесь к изменяющимся рыночным условиям?',
    adaptability2: 'Как вы справляетесь с неожиданными изменениями в процессе продаж?',
    problemSolving1: 'Как вы подходите к сложным проблемам клиентов?',
    problemSolving2: 'Насколько вы уверены в поиске креативных решений?',
    empathy1: 'Насколько хорошо вы понимаете скрытые заботы ваших клиентов?',
    empathy2: 'Как часто вы отражаете то, что говорят клиенты?',
    empathy3: 'Насколько комфортно вам ведение эмоциональных разговоров?',
    anxiety1: 'Как часто вы откладываете важные звонки из-за тревоги?',
    anxiety2: 'Насколько комфортно вы себя чувствуете перед холодными звонками?',
    anxiety3: 'Как вы справляетесь с предвкушением сложных разговоров?'
  }
};