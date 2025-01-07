import { drizzle } from 'drizzle-orm/libsql/node'

export const db = drizzle({
  connection: {
    // url file path
    url: 'file:./db.sqlite',
  },
})
