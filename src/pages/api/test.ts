// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const openai = new OpenAI({
    apiKey: 'huadong-uF1qYdz8wvyX', // defaults to process.env["OPENAI_API_KEY"]
    baseURL: "https://openai.in.zhihu.com/v1"
  });

  const prompt = `  你是一位精通简体中文的字幕翻译人员，曾参与专业的字幕组翻译工作，因此对于各种各样的视频字幕翻译有着深入的理解。我希望你能帮我将以下英文字幕翻译成中文，风格偏向于幽默。

  规则：
  - 输入会给你一个英文字幕的json数组，数组元素对应一句字幕，不要随意拆分，合并或删除某一句字幕
  - 翻译时要准确传达字幕事实和背景。
  - 保留特定的英文术语或名字，并在其前后加上空格，例如："中 UN 文"。
  - 针对每一句字幕分成两次翻译：
    1. 根据字幕内容直译，不要遗漏任何信息
    2. 根据第一次直译的结果重新意译，遵守原意的前提下让内容更通俗易懂，符合中文表达习惯
  - 翻译结果输出到json数组, 注意和输入数组的字幕一一对应，直接翻译结果放到first字段中，意译结果放到second字段中

  输入：
  ### [" Hey, what's up guys.","So I've been thinking a lot about game design recently.","As you might know, game design is built on various principles.","Principles that have been created by people to better describe what game design is and how to use it as a tool."," These are high level concepts and very much the nuts and bolts of game design.","And I plan to talk about these in more detail in future videos.","But you see, there's actually a deeper primordial layer under this, a level of understanding that"," makes those tools have more meaning.","That's what I want to discuss in this video and teach you guys about it and offer a new perspective that I believe can help you to become a better game designer.","It most certainly helped me."," So what is game design?","Like, what is it really?","You know, as mentioned, there's various principles that have been extensively documented in different books and, you know, GDC talks, things like foreshadowing, space, goal systems and reward mechanics.","These principles, as far as I can see, are simply tools used to tease out this underlying layer, this essence that lies underneath this core"," force, let's call it.","And while these tools have immense utility in harnessing said force, without an awareness of what it actually is we're trying to manipulate underneath, these tools can kind of lose their meaning and leave you as lost as you were without them.","Because a tool will tell you how, but"," but a tool won't always tell you why.","And it's why I'm making this video, because I feel that if we understand the original motivation that lies underneath, which affects all of these decisions, we have a much clearer understanding of how to move forward.","Now, this underlying essence is the same which creates good music."] ###

  输出格式：
  [{"first": #对应的直接翻译结果, "second": #对应的意译结果}, {"first": #对应的直接翻译结果, "second": #对应的意译结果}, ...]`;
  console.log(prompt);

  const chatCompletion = await openai.chat.completions.create({
    messages: [{
      role: 'user', content: prompt}],
    model: 'AZURE4',
    temperature: 1,
    stream: true,
    n: 10
  });

  console.log(chatCompletion);

  for await (const chunk of chatCompletion) {
    // res.status(200).json(chunk)
    console.log(chunk.choices[0].delta.content);
  }
  res.status(200).json(chatCompletion);
}
