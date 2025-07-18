export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, tone } = req.body;

  if (!input || !tone) {
    return res.status(400).json({ error: 'Input and tone are required' });
  }

  try {
    // Call Claude API to generate the email
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Generate a professional email based on the following request: "${input}"

The email should have a ${tone} tone. Please follow these guidelines:
- Write a compelling and relevant subject line
- Create a professional greeting
- Write the body content that addresses the request thoughtfully and appropriately
- Include a professional closing
- Use placeholders like [Recipient Name] and [Your Name] where appropriate
- Make the email sound natural and engaging, not templated
- Ensure the tone matches: ${tone}

Format the response as:
Subject: [Generated Subject Line]

[Generated Email Content]

Make sure the email is well-structured, professional, and addresses the specific request in the input.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedEmail = data.content[0].text;

    res.status(200).json({ email: generatedEmail });

  } catch (error) {
    console.error('Error generating email:', error);
    
    // Fallback to improved template system if AI fails
    const fallbackEmail = generateFallbackEmail(input, tone);
    res.status(200).json({ 
      email: fallbackEmail,
      fallback: true,
      message: "Using fallback generator (AI temporarily unavailable)"
    });
  }
}

function generateFallbackEmail(input, tone) {
  // Improved fallback system with better templates
  const subject = generateSubject(input);
  const greeting = "Dear [Recipient Name],";
  const opening = getOpening(tone);
  const body = generateBody(input, tone);
  const closing = getClosing(tone);
  const signature = "Best regards,\n[Your Name]";

  return `Subject: ${subject}\n\n${greeting}\n\n${opening}\n\n${body}\n\n${closing}\n\n${signature}`;
}

function generateSubject(input) {
  const keywords = input.toLowerCase();
  
  if (keywords.includes('meeting') || keywords.includes('schedule')) {
    return "Meeting Request";
  } else if (keywords.includes('proposal') || keywords.includes('project')) {
    return "Project Proposal";
  } else if (keywords.includes('acquisition') || keywords.includes('acquire')) {
    return "Strategic Acquisition Proposal";
  } else if (keywords.includes('partnership') || keywords.includes('collaboration')) {
    return "Partnership Opportunity";
  } else if (keywords.includes('follow up') || keywords.includes('followup')) {
    return "Follow-up on Previous Discussion";
  } else if (keywords.includes('interview') || keywords.includes('job')) {
    return "Interview Request";
  } else if (keywords.includes('update') || keywords.includes('status')) {
    return "Project Update";
  } else {
    return "Important Business Matter";
  }
}

function getOpening(tone) {
  switch (tone) {
    case 'formal':
      return "I hope this message finds you well.";
    case 'friendly':
      return "I hope you're doing well!";
    case 'urgent':
      return "I hope this message finds you well. I'm writing regarding a time-sensitive matter.";
    case 'casual':
      return "Hope you're having a great day!";
    default:
      return "I hope this message finds you well.";
  }
}

function generateBody(input, tone) {
  const baseMessage = `I am writing to discuss ${input}. `;
  
  switch (tone) {
    case 'formal':
      return baseMessage + "This matter requires careful consideration and I believe it presents significant opportunities for our organization. I would appreciate the opportunity to discuss this in detail and explore how we can move forward effectively.";
    case 'friendly':
      return baseMessage + "I'm really excited about this opportunity and think it could be great for both of us. I'd love to chat more about it and see how we can make this work.";
    case 'urgent':
      return baseMessage + "This is a time-sensitive opportunity that requires immediate attention. I believe quick action on this matter could yield significant benefits, and I'm hoping we can discuss next steps as soon as possible.";
    case 'casual':
      return baseMessage + "I think this could be really interesting for us to explore together. Let me know what you think and if you'd like to discuss it further.";
    default:
      return baseMessage + "I believe this represents a valuable opportunity and would appreciate the chance to discuss it with you in more detail.";
  }
}

function getClosing(tone) {
  switch (tone) {
    case 'formal':
      return "I would welcome the opportunity to schedule a meeting to discuss this matter further. Please let me know your availability at your earliest convenience.";
    case 'friendly':
      return "I'd love to hear your thoughts on this! Let me know when you're free to chat.";
    case 'urgent':
      return "Given the time-sensitive nature of this matter, I would greatly appreciate a prompt response. I'm available to discuss this at your earliest convenience.";
    case 'casual':
      return "Let me know what you think! I'm flexible on timing and happy to work around your schedule.";
    default:
      return "I look forward to hearing from you and discussing this opportunity further.";
  }
}
