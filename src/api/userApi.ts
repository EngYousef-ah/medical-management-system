export interface RegisterUser {
  name: string
  email: string
  password: string
  role: "doctor" | "patient"
}
const API_URL = "https://my-json-server.typicode.com/EngYousef-ah/medical-management-system";
export const registerUser = async (user: RegisterUser) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error("Failed to register user")
  }
  console.log("register successfully");

  return response.json()
}




export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users`)
  if (!response.ok) throw new Error("Login failed")

  const users: RegisterUser[] = await response.json()


  const user = users.find(u =>
    u.email.toLowerCase().trim() === email.toLowerCase().trim() &&
    u.password.trim() === password.trim()
  )

  return user || null
}