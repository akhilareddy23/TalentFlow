const Job = require("../models/Job");

// @desc    Chat with Meta AI assistant and get job recommendations
// @route   POST /api/ai/chat
// @access  Private (Candidate only)
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;

    if (!message) {
      return res.status(400).json({ message: "Message query is required." });
    }

    // Fetch all available jobs in the database
    const jobs = await Job.find().populate("createdBy", "name company");

    // Check if Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        // Build the prompt for the Google Gemini LLM
        const prompt = `You are Meta AI, an advanced AI recruiter and assistant. You are helping a user find job opportunities and answer career questions.
User Profile:
- Name: ${user.name}
- Title: ${user.title || "Not specified"}
- Skills: ${user.skills && user.skills.length > 0 ? user.skills.join(", ") : "None"}
- Experience: ${user.experienceYears || 0} years
- College: ${user.college || "Not specified"}
- Degree: ${user.degree || "Not specified"}
- Current Company: ${user.currentCompany || "Not specified"}
- Current Salary: ${user.currentCtc || "Not specified"}
- Expected Salary: ${user.expectedCtc || "Not specified"}

Available Jobs in Database:
${jobs
  .map(
    (j) =>
      `- ID: ${j._id}, Title: ${j.title}, Company: ${j.company}, Skills: ${
        j.skills ? j.skills.join(", ") : "None"
      }, Description: ${j.description}, Salary: ${j.salary || "Not specified"}`
  )
  .join("\n")}

User Query: "${message}"

Please respond in JSON format with exactly two fields:
1. "reply": A friendly, helpful message explaining which jobs are a match and why. Make it highly personalized to their profile and query. You must write the reply in standard sentence case (only capitalize the first letter of each sentence, do not use ALL CAPS or uppercase transformations).
2. "recommendedJobIds": An array of job IDs (strings) from the available jobs list that match the user's query and profile. If the query is a general question or no jobs match, this must be an empty array [].

Your response must be valid JSON:
{
  "reply": "string",
  "recommendedJobIds": ["id1", "id2"]
}`;

        // Call Gemini API using native fetch
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json"
              }
            }),
          }
        );

        if (geminiResponse.ok) {
          const result = await geminiResponse.json();
          const resultText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // Clean response in case the model returns markdown JSON blocks
          let responseText = resultText.trim();
          if (responseText.startsWith("```json")) {
            responseText = responseText.substring(7);
          }
          if (responseText.endsWith("```")) {
            responseText = responseText.substring(0, responseText.length - 3);
          }

          try {
            const data = JSON.parse(responseText.trim());
            return res.status(200).json(data);
          } catch (jsonErr) {
            console.error("Failed to parse Gemini JSON output:", responseText);
            // Fallback to text wrapping if JSON parse fails
            return res.status(200).json({
              reply: responseText || "I analyzed your request but had trouble formatting the response.",
              recommendedJobIds: [],
            });
          }
        } else {
          console.error("Gemini API call failed status:", geminiResponse.status);
        }
      } catch (geminiError) {
        console.error("Gemini API request error:", geminiError);
      }
    }

    // Fallback Local Matching Logic (if API key is missing or fails)
    const isRecommendationQuery =
      message.toLowerCase().includes("job") ||
      message.toLowerCase().includes("profile") ||
      message.toLowerCase().includes("recommend") ||
      message.toLowerCase().includes("match") ||
      message.toLowerCase().includes("work");

    if (isRecommendationQuery) {
      const userSkills = (user.skills || []).map((s) => s.toLowerCase().trim());
      const userTitle = (user.title || "").toLowerCase().trim();

      // Simple intersection matching
      const matches = jobs
        .map((job) => {
          let score = 0;
          const jobSkills = (job.skills || []).map((s) => s.toLowerCase().trim());
          const jobTitle = job.title.toLowerCase().trim();

          // Title matching
          if (userTitle && (jobTitle.includes(userTitle) || userTitle.includes(jobTitle))) {
            score += 3;
          }

          // Skill intersection matching
          const intersection = jobSkills.filter((s) => userSkills.includes(s));
          score += intersection.length;

          return { job, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const recommendedJobIds = matches.map((m) => m.job._id);

      let reply = "";
      if (recommendedJobIds.length > 0) {
        reply = `I have scanned our database and found ${
          recommendedJobIds.length
        } job openings matching your profile title and skills (${userSkills.join(
          ", "
        )}). Below are the top matches for you.`;
      } else {
        reply = "I could not find any active job listings matching your skills directly in our database at the moment.";
      }

      if (!apiKey || apiKey === "your_gemini_api_key_here") {
        reply += " (Note: Please set a valid GEMINI_API_KEY in your backend .env file to enable intelligent AI responses.)";
      }

      return res.status(200).json({
        reply,
        recommendedJobIds,
      });
    }

    // General query response
    let generalReply = "Hello! I am your Meta AI assistant. You can ask me to find job listings related to your profile, match your skills, or check your profile status.";
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      generalReply += " (To activate fully conversational answers, please add a GEMINI_API_KEY inside your .env configuration file.)";
    }

    return res.status(200).json({
      reply: generalReply,
      recommendedJobIds: [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to process request with AI assistant.",
      error: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};
