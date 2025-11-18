import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'Admin' | 'Supervisor' | 'User';
    };
  }

  interface User {
    id: string;
    role: 'Admin' | 'Supervisor' | 'User';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'Admin' | 'Supervisor' | 'User';
  }
}

