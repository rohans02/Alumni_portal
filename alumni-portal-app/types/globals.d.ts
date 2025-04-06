export {}

// Create a type for the roles
export type Roles = 'student' | 'admin' | 'alumni'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}