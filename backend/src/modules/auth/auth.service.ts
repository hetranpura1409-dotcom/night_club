import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { VerifyDto } from './dto/verify.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async signUp(signUpDto: SignUpDto) {
        let { firstName, lastName, email, mobile, password, name } = signUpDto;

        // Handle simplified signup (name only)
        if (name && (!firstName || !lastName)) {
            const parts = name.trim().split(' ');
            firstName = parts[0];
            lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
        }

        // Handle missing email (mobile-only signup)
        if (!email) {
            email = `${mobile}@temp.nightclub.com`;
        }

        // Handle missing password
        if (!password) {
            password = Math.random().toString(36).slice(-8);
        }

        // Check if user already exists by email OR mobile
        const existingUser = await this.userRepository.findOne({
            where: [
                { email },
                { mobile }
            ]
        });

        if (existingUser) {
            throw new BadRequestException('User with this mobile or email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate custom user code (e.g., VK123456)
        const fInitial = firstName ? firstName.charAt(0) : 'U';
        const lInitial = lastName ? lastName.charAt(0) : 'U';
        const initials = (fInitial + lInitial).toUpperCase();
        const randomNumbers = Math.floor(100000 + Math.random() * 900000); // 6-digit number
        const userCode = `${initials}${randomNumbers}`;

        // Create new user
        const user = this.userRepository.create({
            firstName: firstName || '',
            lastName: lastName || '',
            email,
            mobile,
            password: hashedPassword,
            userCode,
        });

        await this.userRepository.save(user);

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        // For POC, we return a mock verification code if strict verification isn't enabled
        return {
            message: 'Sign up successful',
            accessToken,
            mockCode: '123456', // Return mock code for mobile app
            user: {
                id: user.id,
                userCode: user.userCode,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
            },
        };
    }

    async signIn(email: string, password: string) {
        // Find user by email
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                userCode: user.userCode,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
            },
        };
    }

    async verify(verifyDto: VerifyDto) {
        const { mobile, code } = verifyDto;

        // Find user by mobile
        const user = await this.userRepository.findOne({ where: { mobile } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // For POC, accept any 6-digit code
        if (code.length !== 6) {
            throw new BadRequestException('Invalid verification code');
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                userCode: user.userCode,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
            },
        };
    }

    async getProfile(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            userCode: user.userCode,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            birthday: user.birthday,
            createdAt: user.createdAt,
        };
    }

    async updateProfile(userId: string, data: { firstName?: string; lastName?: string; email?: string; mobile?: string; birthday?: string }) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (data.firstName !== undefined) user.firstName = data.firstName;
        if (data.lastName !== undefined) user.lastName = data.lastName;
        if (data.email !== undefined) user.email = data.email;
        if (data.mobile !== undefined) user.mobile = data.mobile;
        if (data.birthday !== undefined) user.birthday = data.birthday;

        await this.userRepository.save(user);

        return {
            id: user.id,
            userCode: user.userCode,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            birthday: user.birthday,
        };
    }

    async getAllUsers() {
        const users = await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
        return users.map(user => ({
            id: user.id,
            userCode: user.userCode,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            createdAt: user.createdAt,
        }));
    }
}
