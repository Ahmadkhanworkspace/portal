import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Seed initial users for testing
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Default users to create
    const defaultUsers = [
      {
        name: 'Admin User',
        email: 'admin@cometportal.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'Admin',
      },
      {
        name: 'Supervisor User',
        email: 'supervisor@cometportal.com',
        password: await bcrypt.hash('supervisor123', 10),
        role: 'Supervisor',
      },
      {
        name: 'Regular User',
        email: 'user@cometportal.com',
        password: await bcrypt.hash('user123', 10),
        role: 'User',
      },
    ];

    const createdUsers = [];
    const existingUsers = [];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        if (force) {
          // Update existing user with new password
          existingUser.password = userData.password;
          existingUser.role = userData.role;
          existingUser.name = userData.name;
          await existingUser.save();
          createdUsers.push(existingUser);
        } else {
          existingUsers.push(userData.email);
        }
      } else {
        // Create new user
        const newUser = await User.create(userData);
        createdUsers.push(newUser);
      }
    }

    if (createdUsers.length === 0 && existingUsers.length > 0 && !force) {
      return NextResponse.json({
        success: true,
        message: 'Users already exist. Use ?force=true to update them.',
        existingUsers: existingUsers,
      });
    }

    return NextResponse.json({
      success: true,
      message: force ? 'Users updated/created successfully' : 'Seed data created successfully',
      data: {
        usersCreated: createdUsers.length,
        users: createdUsers.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
        })),
        existingUsers: existingUsers,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

