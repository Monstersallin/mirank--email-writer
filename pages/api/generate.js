export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, tone } = req.body;

  if (!input || !tone) {
    return res.status(400).json({ error: 'Input and tone are required' });
  }

  try {
    // Generate intelligent email using smart template system
    const generatedEmail = generateSmartEmail(input, tone);
    res.status(200).json({ email: generatedEmail });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
}

function generateSmartEmail(input, tone) {
  // Parse and understand the input
  const cleanInput = input.toLowerCase().trim();
  const context = analyzeContext(cleanInput);
  
  // Generate components
  const subject = generateIntelligentSubject(context, cleanInput);
  const greeting = generateGreeting(tone);
  const opening = generateOpening(tone);
  const body = generateIntelligentBody(context, cleanInput, tone);
  const closing = generateClosing(tone);
  const signature = generateSignature();

  return `Subject: ${subject}\n\n${greeting}\n\n${opening}\n\n${body}\n\n${closing}\n\n${signature}`;
}

function analyzeContext(input) {
  const context = {
    type: 'general',
    urgency: 'normal',
    recipient: 'colleague',
    action: 'request'
  };

  // Analyze email type
  if (input.includes('meeting') || input.includes('schedule') || input.includes('appointment')) {
    context.type = 'meeting';
  } else if (input.includes('proposal') || input.includes('project') || input.includes('initiative')) {
    context.type = 'proposal';
  } else if (input.includes('approval') || input.includes('approve') || input.includes('permission')) {
    context.type = 'approval';
  } else if (input.includes('update') || input.includes('status') || input.includes('progress')) {
    context.type = 'update';
  } else if (input.includes('follow up') || input.includes('followup') || input.includes('following up')) {
    context.type = 'followup';
  } else if (input.includes('interview') || input.includes('position') || input.includes('role') || input.includes('job')) {
    context.type = 'job';
  } else if (input.includes('acquisition') || input.includes('acquire') || input.includes('purchase')) {
    context.type = 'acquisition';
  } else if (input.includes('partnership') || input.includes('collaboration') || input.includes('work together')) {
    context.type = 'partnership';
  }

  // Analyze recipient
  if (input.includes('leadership') || input.includes('executive') || input.includes('ceo') || input.includes('director')) {
    context.recipient = 'leadership';
  } else if (input.includes('team') || input.includes('group') || input.includes('department')) {
    context.recipient = 'team';
  } else if (input.includes('client') || input.includes('customer') || input.includes('vendor')) {
    context.recipient = 'external';
  }

  // Analyze urgency
  if (input.includes('urgent') || input.includes('asap') || input.includes('immediately') || input.includes('quickly')) {
    context.urgency = 'high';
  } else if (input.includes('when convenient') || input.includes('no rush') || input.includes('whenever')) {
    context.urgency = 'low';
  }

  return context;
}

function generateIntelligentSubject(context, input) {
  const subjects = {
    meeting: [
      "Meeting Request",
      "Schedule Discussion",
      "Appointment Request",
      "Meeting Availability"
    ],
    proposal: [
      "Project Proposal",
      "New Initiative Proposal",
      "Strategic Proposal",
      "Business Proposal"
    ],
    approval: [
      "Approval Request",
      "Request for Approval",
      "Authorization Needed",
      "Approval Sought"
    ],
    update: [
      "Project Update",
      "Status Update",
      "Progress Report",
      "Current Status"
    ],
    followup: [
      "Follow-up Discussion",
      "Following Up",
      "Next Steps",
      "Continued Discussion"
    ],
    job: [
      "Position Discussion",
      "Role Request",
      "Career Opportunity",
      "Employment Matter"
    ],
    acquisition: [
      "Acquisition Proposal",
      "Strategic Acquisition",
      "Business Acquisition",
      "Purchase Proposal"
    ],
    partnership: [
      "Partnership Opportunity",
      "Collaboration Proposal",
      "Strategic Partnership",
      "Joint Initiative"
    ],
    general: [
      "Important Discussion",
      "Business Matter",
      "Important Request",
      "Professional Matter"
    ]
  };

  const subjectOptions = subjects[context.type] || subjects.general;
  return subjectOptions[0]; // Return the most appropriate subject
}

function generateGreeting(tone) {
  const greetings = {
    formal: "Dear [Recipient Name],",
    friendly: "Hi [Recipient Name],",
    urgent: "Dear [Recipient Name],",
    casual: "Hey [Recipient Name],"
  };
  
  return greetings[tone] || greetings.formal;
}

function generateOpening(tone) {
  const openings = {
    formal: "I hope this message finds you well.",
    friendly: "I hope you're doing well!",
    urgent: "I hope this message finds you well. I'm writing regarding a time-sensitive matter.",
    casual: "Hope you're having a great day!"
  };
  
  return openings[tone] || openings.formal;
}

function generateIntelligentBody(context, input, tone) {
  // Extract key information from input
  const cleanedInput = input.replace(/\b(to|for|about|regarding|concerning)\b/gi, '');
  const mainRequest = cleanedInput.trim();
  
  const bodyTemplates = {
    approval: {
      formal: `I am writing to formally request approval for ${mainRequest}. This initiative represents a strategic opportunity that aligns with our organizational goals and would bring significant value to our operations.

I have carefully considered the implications and believe this represents the best path forward. I would be happy to provide additional details or documentation to support this request.`,
      friendly: `I'm reaching out to get approval for ${mainRequest}. I think this could be a great opportunity for us and would love to move forward with it.

I'm excited about the potential benefits this could bring and would be happy to discuss any questions you might have.`,
      urgent: `I need to request urgent approval for ${mainRequest}. This is a time-sensitive opportunity that requires immediate attention to ensure we don't miss this window.

Given the urgency of this matter, I would greatly appreciate expedited consideration of this request.`,
      casual: `I wanted to touch base about getting approval for ${mainRequest}. I think this could be really beneficial for us.

Let me know what you think and if you need any additional information from me.`
    },
    meeting: {
      formal: `I would like to schedule a meeting to discuss ${mainRequest}. This is an important matter that would benefit from in-person discussion and collaboration.

I am flexible with timing and can accommodate your schedule. Please let me know your availability for the coming weeks.`,
      friendly: `I'd love to set up a meeting to talk about ${mainRequest}. I think it would be great to discuss this in person and get your thoughts.

Let me know when you're free - I'm pretty flexible with timing!`,
      urgent: `I need to schedule an urgent meeting regarding ${mainRequest}. This matter requires immediate attention and discussion.

Would you be available for a meeting this week? I can accommodate your schedule for this important discussion.`,
      casual: `Can we grab some time to chat about ${mainRequest}? I think it would be good to discuss this face-to-face.

Let me know when works for you - I'm flexible!`
    },
    job: {
      formal: `I am writing to discuss ${mainRequest}. This represents an important career development opportunity that I believe would benefit both myself and the organization.

I would welcome the opportunity to discuss this in detail and explore how we can move forward with this initiative.`,
      friendly: `I wanted to talk to you about ${mainRequest}. I'm really excited about this opportunity and think it could be great for everyone involved.

I'd love to chat more about this and see how we can make it work.`,
      urgent: `I need to discuss ${mainRequest} with you as soon as possible. This is a time-sensitive opportunity that requires prompt attention.

I would greatly appreciate the chance to discuss this with you at your earliest convenience.`,
      casual: `I wanted to bring up ${mainRequest} with you. I think this could be a really good opportunity.

Let me know what you think and if you'd like to discuss it further.`
    },
    general: {
      formal: `I am writing to discuss ${mainRequest}. This matter requires careful consideration and I believe it presents significant opportunities for our organization.

I would appreciate the opportunity to discuss this in detail and explore how we can move forward effectively.`,
      friendly: `I wanted to reach out about ${mainRequest}. I think this could be a great opportunity for us to explore together.

I'd love to hear your thoughts on this and see how we can move forward.`,
      urgent: `I need to discuss ${mainRequest} with you urgently. This is a time-sensitive matter that requires immediate attention.

Given the urgency of this situation, I would greatly appreciate a prompt response.`,
      casual: `I wanted to touch base about ${mainRequest}. I think this could be really interesting for us to look into.

Let me know what you think and if you'd like to chat more about it.`
    }
  };

  const categoryTemplates = bodyTemplates[context.type] || bodyTemplates.general;
  return categoryTemplates[tone] || categoryTemplates.formal;
}

function generateClosing(tone) {
  const closings = {
    formal: "I look forward to hearing from you and would welcome the opportunity to discuss this matter further at your convenience.",
    friendly: "I'd love to hear your thoughts on this! Let me know when you're free to chat.",
    urgent: "Given the time-sensitive nature of this matter, I would greatly appreciate a prompt response. I'm available to discuss this at your earliest convenience.",
    casual: "Let me know what you think! I'm flexible on timing and happy to work around your schedule."
  };
  
  return closings[tone] || closings.formal;
}

function generateSignature() {
  return "Best regards,\n[Your Name]";
}
