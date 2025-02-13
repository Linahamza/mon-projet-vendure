
//Ajouter une API GraphQL pour Exposer les Marques


import { Resolver, Query } from '@nestjs/graphql';
import { MarqueService } from '../services/MarqueService';
import { Marque } from '../entities/Marque.entity';

@Resolver()
export class MarqueResolver {
    private marqueService = new MarqueService();

    @Query(() => [Marque])
    async marques(): Promise<Marque[]> {
        return this.marqueService.getAllMarques();
    }
}