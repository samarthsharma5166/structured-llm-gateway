import express from 'express';
import {loadEnv} from "./env";
import cors from 'cors'
import { askStructure } from './ask-core';

loadEnv();

const app = express();


app.use(
    cors({
        origin:['http://localhost:3000/'],
        methods:["POST","GET","OPTIONS","DELETE"],
        allowedHeaders:['Content-Type',"Authorization"],
        credentials:false
    })
);
app.use(express.json());

app.post("/ask",async (req,res)=>{
    try {
        const body = req.body;
        const query = body.query as string | undefined;

        if(!query){
            return res.status(400).json({
                error:"Missing query"
            })
        }
        const result = await askStructure(query);

        return res.status(200).json(result);
    } catch (error:any) {
        console.error("Error in /ask route:", {
            message: error.message,
            stack: error.stack,
            status: error.status,
            statusText: error.statusText,
            errorDetails: error.errorDetails
        });
        
        const status = typeof error.status === 'number' ? error.status : 500;
        return res.status(status).json({
        error: error.message || "Failed to answer",
            details: error.errorDetails || null
        });
    }
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
