interface AuthResult {
  success: boolean;
  role?: 'user' | 'admin';
  fullName?: string;
}

const mockUsers = [
  { email: 'user@example.com', password: 'userpass', role: 'user', fullName: 'John Doe' },
  { email: 'admin@example.com', password: 'adminpass', role: 'admin', fullName: 'Jane Smith' },
];

export function mockAuth(email: string, password: string): AuthResult {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    return { success: true, role: user.role as 'user' | 'admin', fullName: user.fullName };
  }
  
  return { success: false };
}

