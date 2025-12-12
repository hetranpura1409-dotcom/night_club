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
        const { firstName, lastName, email, mobile, password } = signUpDto;

        // Check if user already exists by email
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate custom user code (e.g., VK123456)
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        const randomNumbers = Math.floor(100000 + Math.random() * 900000); // 6-digit number
        const userCode = `${initials}${randomNumbers}`;

        // Create new user
        const user = this.userRepository.create({
            firstName,
            lastName,
            email,
            mobile,
            password: hashedPassword,
            userCode,
        });

        await this.userRepository.save(user);

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            message: 'Sign up successful',
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
            createdAt: user.createdAt,
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
