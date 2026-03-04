import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getUserFavorites(@Request() req) {
        return this.favoritesService.getUserFavorites(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':nightclubId')
    async addFavorite(@Request() req, @Param('nightclubId') nightclubId: string) {
        return this.favoritesService.addFavorite(req.user.id, nightclubId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':nightclubId')
    async removeFavorite(@Request() req, @Param('nightclubId') nightclubId: string) {
        await this.favoritesService.removeFavorite(req.user.id, nightclubId);
        return { message: 'Favorite removed' };
    }
}
