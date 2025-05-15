import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { Topic } from '~/entities/topic.entity'
import { isValidNumber } from '~/utils'

export async function checkIdDeleteTopicMiddleware(
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) {
  const TopicId = parseInt(req.params?.id)
  if (req.params?.id && !isValidNumber(req.params?.id)) {
    res.status(404).json({ message: 'Id không hợp lệ' })
    return
  }

  const topic = await Topic.findOne({
    where: { id: TopicId },
    relations: ['wordTopics']
  })

  if (!topic) {
    res.status(404).json({ message: 'Không tồn tại topic!' })
  } else if (topic.wordTopics && topic.wordTopics.length > 0) {
    res.status(400).json({ message: 'Tồn tại từ vựng thuộc topic' })
  } else next()
}
