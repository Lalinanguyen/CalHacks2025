import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      githubToken?: string
    } & DefaultSession['user']
  }

  interface JWT {
    githubToken?: string
  }
}
