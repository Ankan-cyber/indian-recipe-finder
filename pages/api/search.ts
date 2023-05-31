// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

type Data = {
    success: boolean,
    result?: unknown,
    msg?: unknown
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URI: string,
            API_KEY: string
        }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URI);

    let success = false;
    if (Object.keys(req.query).length === 0) {
        res.status(400).json({ success, msg: "No input given" });
    }
    else if (req.headers['api-key'] != process.env.API_KEY) {
        res.status(401).json({ success, msg: "Unauthorized" })
    }
    else {
        const query = req.query.q;
        console.log(query)
        if (query === undefined || query.length === 0) {
            res.status(400).json({ success, msg: "No input given" });
        }
        else {
            try {
                const db = mongoose.connection;
                db.on('error', () => {
                    throw new Error('Connection error');
                });

                const result = await db.collection("recipe").find({ RecipeName: { $regex: new RegExp(query as string, "i") } }).toArray();
                return res.status(200).json({ success: true, result });
            }
            catch (err) {
                return res.status(400).json({ success: false, msg: err });
            }
        }

    }
}

