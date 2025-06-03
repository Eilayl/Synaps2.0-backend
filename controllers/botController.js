const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.APIresponse = async (req, res) => {
  try {
    const { prompt, threadId: incomingThreadId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing 'prompt' in request body." });
    }

    let threadId = incomingThreadId;

    if (!threadId) {
      // אם אין threadId — צור חדש
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    // הוסף הודעת משתמש ל-thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt,
    });

    // הרץ את האסיסטנט
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
    });

    // המתן לסיום הריצה
    let runStatus = run.status;
    let finalRun = run;
    while (runStatus === "queued" || runStatus === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      finalRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
      runStatus = finalRun.status;
    }

    // קבל את ההודעות
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessages = messages.data.filter(msg => msg.role === "assistant");

    const lastMessage = assistantMessages[0]?.content?.[0];
    const responseText = (lastMessage?.type === "text") ? lastMessage.text.value : "No response from assistant.";

    // החזר את התגובה וגם את ה-threadId כדי לשמור בצד לקוח
    return res.send({message: {response: responseText, thread:threadId}});

  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
