const { createClient } = require("@deepgram/sdk");
const { config } = require("dotenv");
const express = require("express");
const { z } = require("zod");
const cors = require("cors");

config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());
const paragraphSchema = z.object({
  paragraph: z
    .string()
    .min(5, { message: "Paragraph should be at least of 5 characters" })
    .max(100, { message: "Paragraph should be no more than 100 characters" }),
});

app.post("/read-paragraph", async (req, res) => {
  const parsedBody = paragraphSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(411).json({
      message: parsedBody.error,
    });
  }

  const { paragraph } = parsedBody.data;

  try {
    const audioBuffer = await getAudio(paragraph);

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", 'attachment; filename="output.wav"');

    return res.status(200).send({ paragraph, audioBuffer : audioBuffer.toString("base64") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on PORT 3000");
});

const getAudio = async (text) => {
  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-asteria-en",
      encoding: "linear16",
      container: "wav",
    }
  );

  const stream = await response.getStream();
  if (stream) {
    const buffer = await getAudioBuffer(stream);
    return buffer;
  } else {
    throw new Error("Error generating audio");
  }
};

const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};
