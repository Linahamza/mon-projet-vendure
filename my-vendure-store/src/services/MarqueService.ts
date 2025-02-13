//Créer un Service pour Récupérer les Marques

import { Repository } from 'typeorm';
import { sqliteDataSource } from '../database/sqlite-connection';
import { Marque } from '../entities/Marque.entity';

export class MarqueService {
    private marqueRepo: Repository<Marque>;

    constructor() {
        this.marqueRepo = sqliteDataSource.getRepository(Marque);
    }

    async getAllMarques(): Promise<Marque[]> {
        return this.marqueRepo.find();
    }
}
