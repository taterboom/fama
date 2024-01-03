import Sqids from "sqids"
import { v4 as uuid } from "uuid"

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).join("")
const sqids = new Sqids({ minLength: 6, alphabet })

export const encode = (id: number) => sqids.encode([id])

export const decode = (id: string) => sqids.decode(id)[0]

export const formatId = (id: string | number) =>
  typeof id === "string" ? (decode(id) as number | undefined) : id

export const generateKey = () => uuid()
