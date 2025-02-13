// Créer un Plugin Vendure pour Encapsuler la Logique

import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';
import { MarqueResolver } from '../graphql/MarqueResolver';

// Définir le schéma GraphQL pour les marques
const marqueSchema = gql`
    type Marque {
        id: ID!
        nom: String!
    }

    extend type Query {
        marques: [Marque!]!
    }
`;

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [MarqueResolver],
    adminApiExtensions: {
        schema: marqueSchema, // Schéma GraphQL pour l'API Admin
        resolvers: [MarqueResolver], // Resolver pour l'API Admin
    },
    shopApiExtensions: {
        schema: marqueSchema, // Schéma GraphQL pour l'API Shop
        resolvers: [MarqueResolver], // Resolver pour l'API Shop
    },
})
export class MarquePlugin {}