import { License, PrismaClient } from "@prisma/client"
import express from "express"
import { encode, formatId } from "./utils"

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

app.get("/licenses", async (req, res) => {
  const data = await prisma.license.findMany()
  res.json(data.map(encodeLicense))
})

app.get("/licenses/:id", async (req, res) => {
  const data = await prisma.license.findUnique({
    where: { id: formatId(req.params.id) },
  })
  if (!data) return res.status(404).json({ error: "Not found" })
  return res.json(encodeLicense(data))
})

app.post("/licenses", async (req, res) => {
  console.log(req.body)
  const data = await prisma.license.create({
    data: {
      rest: req.body.rest,
      total: req.body.total,
      biz: req.body.biz,
    },
  })
  return res.json(encodeLicense(data))
})

app.delete("/licenses/:id", async (req, res) => {
  await prisma.license.delete({
    where: { id: formatId(req.params.id) },
  })
  return res.status(204)
})

app.put("/licenses/:id", async (req, res) => {
  const data = await prisma.license.update({
    where: { id: formatId(req.params.id) },
    data: {
      rest: req.body.rest,
      total: req.body.total,
      biz: req.body.biz,
    },
  })
  return res.json(encodeLicense(data))
})

app.listen(3000, () => console.log("Server running on port 3000"))
