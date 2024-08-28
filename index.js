
// actual key: sk - proj - yV7lnpZWmheo_FS9nEazwoIoOrChpCQd7Fz9uUieXhz1Bypaig9urDKIsRT3BlbkFJrwceJl8GA0Lo1M5q92220ua6fBNTUUoMo5_q6VQvIzJW9rRfQFoLxgNhoA
// used key : sk-EVdHpwSaP0GZV27deq6sT3BlbkFJPRqV8SQN1dMkk9fh2Ja
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import OpenAI from "openai";

const app = express();
const server = createServer(app);

app.use(cors({
    origin: "*",
}));

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Configure OpenAI

const openai = new OpenAI({
    apiKey: "sk - proj - yV7lnpZWmheo_FS9nEazwoIoOrChpCQd7Fz9uUieXhz1Bypaig9urDKIsRT3BlbkFJrwceJl8GA0Lo1M5q92220ua6fBNTUUoMo5_q6VQvIzJW9rRfQFoLxgNhoA",

});

io.on('connection', (socket) => {
    console.log("There is a connection");

    socket.on('message', async (msg) => {
        console.log(`Message: ${msg}`);

        try {


            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content: msg,
                    },
                ],
            });

            const aiMessage = response.choices[0].message.content;
            socket.emit('response', { success: true, message: aiMessage });

            // Send the AI response back to the client
            socket.emit('response', aiMessage);
        } catch (error) {
            console.log('Error fetching OpenAI response:', error.message);
            socket.emit('response', { success: false, message: 'Sorry, there was an error processing your request.', error: error.message });
        }
    });
});

const PORT = process.env.PORT || 8080;

app.get('/test', (_, res) => {
    res.send('Server is running');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
