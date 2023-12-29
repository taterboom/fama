/**
 * just for rpc client demo
 */

import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"

const PROTO_PATH = "./license.proto"

const options: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)

const Service = grpc.loadPackageDefinition(packageDefinition).LicenseService

// @ts-ignore
const client = new Service("localhost:50051", grpc.credentials.createInsecure())

export type License = {
  id: number
  rest: number
  total: number
  biz: string
  extra: string | null
}

export function getLicense(id: string | number): Promise<License> {
  return new Promise((resolve, reject) => {
    client.GetLicense({ id }, (error: any, res: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(res)
      }
    })
  })
}

export function consumeLicense(id: string | number): Promise<License> {
  return new Promise((resolve, reject) => {
    client.ConsumeLicense({ id }, (error: any, res: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(res)
      }
    })
  })
}
