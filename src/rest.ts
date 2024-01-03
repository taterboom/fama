import { License, PrismaClient } from "@prisma/client"
import express from "express"
import { encode, generateKey } from "./utils"

const prisma = new PrismaClient()

const app = express()

app.use(express.json())

const encodeLicense = (data: License) => ({ ...data, id: encode(data.id) })

app.use((req, res, next) => {
  if (req.headers["x-junziorxiaoren"] !== process.env.JUNZIORXIAOREN) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  next()
})

app.get("/licenses", async (req, res, next) => {
  try {
    const data = await prisma.license.findMany()
    res.json(data.map(encodeLicense))
  } catch (err) {
    next(err)
  }
})

app.get("/licenses/:key", async (req, res, next) => {
  try {
    const data = await prisma.license.findUnique({
      where: { key: req.params.key },
    })
    if (!data) return res.status(404).json({ error: "Not found" })
    return res.json(encodeLicense(data))
  } catch (err) {
    next(err)
  }
})

app.post("/licenses", async (req, res, next) => {
  try {
    const data = await prisma.license.create({
      data: {
        rest: req.body.rest,
        total: req.body.total,
        biz: req.body.biz,
        key: generateKey(),
      },
    })
    return res.json(encodeLicense(data))
  } catch (err) {
    next(err)
  }
})

app.delete("/licenses/:key", async (req, res, next) => {
  try {
    await prisma.license.delete({
      where: { key: req.params.key },
    })
    return res.status(204)
  } catch (err) {
    next(err)
  }
})

app.put("/licenses/:key", async (req, res, next) => {
  try {
    const data = await prisma.license.update({
      where: { key: req.params.key },
      data: {
        rest: req.body.rest,
        total: req.body.total,
        biz: req.body.biz,
      },
    })
    return res.json(encodeLicense(data))
  } catch (err) {
    next(err)
  }
})

app.post("/licenses/:key/consume", async (req, res, next) => {
  try {
    const license = await prisma.license.findUnique({
      where: { key: req.params.key },
    })

    if (!license) {
      return res.status(404).json({ error: "License not found" })
    }

    if (license.rest <= 0) {
      return res.status(400).json({ error: "No licenses left to consume" })
    }
  } catch (err) {
    next(err)
  }
  try {
    const data = await prisma.license.update({
      where: {
        key: req.params.key,
        rest: {
          gt: 0,
        },
      },
      data: {
        rest: {
          decrement: 1,
        },
      },
    })
    return res.json(encodeLicense(data))
  } catch (err) {
    return res.status(400).json({ error: "No licenses left to consume" })
  }
})

// process.on("unhandledRejection", (reason: any, promise: any) => {
//   console.log("Unhandled Rejection at:", promise, "reason:", reason)
//   if (!(reason.status >= 400 && reason.status < 500)) {
//     const context = (promise.domain && promise.domain.sentryContext) || {}
//     context.extra = context.extra || {}
//     context.extra.unhandledPromiseRejection = true
//   }
// })

app.use((err: any, req: any, res: any, next: any) => {
  console.error("!!!!!!", err.stack)
  res.status(500).json({ error: "Something broke!" })
})

app.listen(3000, () => console.log("Server running on port 3000"))
