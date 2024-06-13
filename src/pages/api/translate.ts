// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from "openai";

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const openai = new OpenAI({
  //   apiKey: 'huadong-uF1qYdz8wvyX', // defaults to process.env["OPENAI_API_KEY"]
  //   baseURL: "https://openai.in.zhihu.com/v1"
  // });

  console.log(req.body)

  const prompt = `
  你是一位精通简体中文的字幕翻译人员，曾参与专业的字幕组翻译工作，因此对于各种各样的视频字幕翻译有着深入的理解。我希望你能帮英文字幕翻译成中文。 

  规则： 
  - 输入会给你一个英文字幕的json数组，每个数组元素对应一句字幕，不要随意拆分，合并或删除某一句字幕
  - 翻译时用幽默的风格，用通俗易懂的语言传达事实和背景。 
  - 针对每一句字幕分成两次翻译：
    1. 根据字幕内容直译，不要遗漏任何信息
    2. 根据第一次直译的结果重新意译，遵守原意的前提下让内容更通俗易懂，符合中文表达习惯
  - 翻译结果输出到json数组, 注意和输入数组的字幕一一对应，直接翻译结果放到first字段中，意译结果放到second字段中
  
  输入：
  ### ${JSON.stringify(req.body)} ###
  
  输出格式：
  [{"first": #对应的直接翻译结果, "second": #对应的意译结果}, {"first": #对应的直接翻译结果, "second": #对应的意译结果}, ...]`;

  console.log(prompt);

  const chatCompletion = await openai.chat.completions.create({
    messages: [{
      role: 'user', content: prompt}],
    model: 'AZURE4',
    temperature: 0,
  });

  res.status(200).json(chatCompletion)
}
