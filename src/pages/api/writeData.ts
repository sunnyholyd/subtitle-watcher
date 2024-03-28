import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = "/Users/sunhuadong/Documents/subtitle/subtitle-workspace/";
  const name = req.body["name"];
  const data = req.body["data"];


  console.log(typeof(data));
  console.log(data);
  const writeData = (typeof(data) == "string") ? data : JSON.stringify(data);

  fs.writeFile(path + name, writeData.toString(), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  res.status(200).json({ message: 'write successed!' })
}

