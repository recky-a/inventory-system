import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** TODO: Change this later with env of better auth url * 
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000"
})
