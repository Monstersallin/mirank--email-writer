export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, tone } = req.body;

  if (!input || !tone) {
    return res.status(400).json({ error: 'Missing input or tone' });
  }

  try {
    // Call Claude API for intelligent email generation
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
            content: `You are an expert email writer. Transform the following raw thoughts into a professional, well-structured email.

Raw thoughts: "${input}"

Tone requested: ${tone}

Instructions:
- Write a complete email with proper subject line
- Make it sound natural and thoughtful, not templated
- Use appropriate ${tone} tone throughout
- Include proper email formatting
- Make the content engaging and purposeful
- Don't use placeholder text like [Your Name] or [Recipient]
- Create a realistic subject line based on the content
- The email should sound like it was written by a real person, not a template

Write the complete email now:`
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
    
    // Fallback to improved template if AI fails
    const fallbackEmail = generateImprovedTemplate(input, tone);
    res.status(200).json({ email: fallbackEmail });
  }
}

// Improved fallback template (better than the basic one)
function generateImprovedTemplate(input, tone) {
  const toneStyles = {
    professional: {
      greeting: "Dear",
      opening: "I hope this message finds you well.",
      closing: "Best regards,"
    },
    warm: {
      greeting: "Hi",
      opening: "I hope you're doing great!",
      closing: "Warm regards,"
    },
    concise: {
      greeting: "Hello",
      opening: "I'm writing to",
      closing: "Best,"
    },
    casual: {
      greeting: "Hey",
      opening: "Hope you're well!",
      closing: "Thanks,"
    },
    persuasive: {
      greeting: "Dear",
      opening: "I hope you're having a wonderful day.",
      closing: "Looking forward to your response,"
    },
    empathetic: {
      greeting: "Dear",
      opening: "I hope you're doing well during these times.",
      closing: "With understanding,"
    }
  };

  const style = toneStyles[tone] || toneStyles.professional;
  
  // Generate a more intelligent subject line
  const subject = generateSubjectLine(input);
  
  return `Subject: ${subject}

${style.greeting} [Recipient Name],

${style.opening}

${enhanceContent(input, tone)}

Please let me know if you'd like to discuss this further or if you need any additional information.

${style.closing}
[Your Name]`;
}

function generateSubjectLine(input) {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('meeting') || lowerInput.includes('schedule')) {
    return "Meeting Request";
  } else if (lowerInput.includes('proposal') || lowerInput.includes('project')) {
    return "Project Proposal";
  } else if (lowerInput.includes('question') || lowerInput.includes('help')) {
    return "Request for Information";
  } else if (lowerInput.includes('update') || lowerInput.includes('status')) {
    return "Status Update";
  } else if (lowerInput.includes('thank') || lowerInput.includes('appreciate')) {
    return "Thank You";
  } else if (lowerInput.includes('follow up') || lowerInput.includes('following up')) {
    return "Follow-up";
  } else {
    return "Important Message";
  }
}

function enhanceContent(input, tone) {
  // Basic content enhancement based on tone
  const enhanced = input.charAt(0).toUpperCase() + input.slice(1);
  
  if (tone === 'professional') {
    return `I am writing to discuss ${enhanced.toLowerCase()}. This matter requires your attention and I believe we can work together to achieve a positive outcome.`;
  } else if (tone === 'warm') {
    return `I wanted to reach out about ${enhanced.toLowerCase()}. I really appreciate your time and I'm excited about the possibility of working together on this.`;
  } else if (tone === 'persuasive') {
    return `I'd like to present an opportunity regarding ${enhanced.toLowerCase()}. I believe this could be mutually beneficial and I'm confident you'll find it interesting.`;
  } else {
    return enhanced;
  }
