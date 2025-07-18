export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, tone } = req.body;

  if (!input || !tone) {
    return res.status(400).json({ error: 'Missing input or tone' });
  }

  try {
    // This is a simplified version - in production you'd call Claude API
    const toneInstructions = {
      professional: "Write in a professional, formal tone. Use proper business language and structure.",
      warm: "Write in a warm, friendly tone while maintaining professionalism.",
      concise: "Write in a concise, direct tone. Get straight to the point.",
      casual: "Write in a casual, conversational tone that's still appropriate for email.",
      persuasive: "Write in a persuasive tone that clearly communicates the request or message.",
      empathetic: "Write in an empathetic, understanding tone that shows care and consideration."
    };

    // For demo purposes, we'll create a structured email format
    const emailTemplate = generateEmailTemplate(input, tone, toneInstructions[tone]);
    
    res.status(200).json({ email: emailTemplate });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
}

function generateEmailTemplate(input, tone, toneInstruction) {
  // This is a simplified template generator
  // In production, you'd integrate with Claude API here
  
  const templates = {
    professional: `Subject: [Your Subject Here]

Dear [Recipient],

I hope this email finds you well. I am writing to ${input.toLowerCase()}.

${input}

I would appreciate your consideration of this matter. Please let me know if you need any additional information.

Best regards,
[Your Name]`,
    
    warm: `Subject: [Your Subject Here]

Hi [Recipient],

I hope you're doing well! I wanted to reach out about ${input.toLowerCase()}.

${input}

Thanks so much for your time and consideration. Looking forward to hearing from you!

Warm regards,
[Your Name]`,
    
    concise: `Subject: [Your Subject Here]

Hi [Recipient],

${input}

Please let me know if you need any additional information.

Best,
[Your Name]`,
    
    casual: `Subject: [Your Subject Here]

Hey [Recipient],

${input}

Let me know what you think!

Thanks,
[Your Name]`,
    
    persuasive: `Subject: [Your Subject Here]

Dear [Recipient],

I hope you're having a great day. I'm reaching out because ${input.toLowerCase()}.

${input}

I believe this would be mutually beneficial, and I'd love to discuss this further at your convenience.

Best regards,
[Your Name]`,
    
    empathetic: `Subject: [Your Subject Here]

Dear [Recipient],

I hope you're doing well. I wanted to reach out regarding ${input.toLowerCase()}.

${input}

I understand this may require consideration, and I'm here if you have any questions or concerns.

With appreciation,
[Your Name]`
  };

  return templates[tone] || templates.professional;
}
