import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { PrismaClient } from "@prisma/client"
import path from "path"
import { formatId } from "./utils"

const PROTO_PATH = path.resolve(__dirname, "./license.proto")

const prisma = new PrismaClient()

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options)
const proto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()

// @ts-ignore
server.addService(proto.LicenseService.service, {
  GetLicense: async (call: any, callback: any) => {
    const data = await prisma.license.findUnique({
      where: {
        id: formatId(call.request.id),
      },
    })
    if (!data) {
      return callback({ code: grpc.status.NOT_FOUND, message: "License not found" })
    }
    callback(null, data)
  },
  ConsumeLicense: async (call: any, callback: any) => {
    const data = await prisma.license.findUnique({
      where: {
        id: formatId(call.request.id),
      },
    })
    if (!data) {
      callback({ code: grpc.status.NOT_FOUND, message: "License not found" })
      return
    }
    if (data.rest > 0) {
      const updateResult = await prisma.license.update({
        where: {
          id: call.request.id,
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
      callback(null, updateResult)
    } else {
      callback({ code: grpc.status.OUT_OF_RANGE, message: "No license left" })
    }
  },
})

server.bindAsync("localhost:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
  console.log("Server running at " + "localhost:50051")
  server.start()
})
