//Créer une Entité TypeORM pour la Table marques

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'marques' }) // Nom de la table existante dans SQLite
export class Marque {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;
}
