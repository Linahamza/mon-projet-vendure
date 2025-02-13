import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
    StockDisplayStrategy,
    RequestContext,
    ProductVariant,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import 'dotenv/config';
import path from 'path';

import { MarquePlugin } from '../src/plugins/MarquePlugin';   //  Active le plugin dans vendure-config.ts

// Stratégie d'affichage du stock personnalisée
export class ExactStockDisplayStrategy implements StockDisplayStrategy {
    getStockLevel(
        ctx: RequestContext,
        productVariant: ProductVariant,
        saleableStockLevel: number
    ): string {
        return saleableStockLevel.toString(); // Affiche le stock sous forme de texte
    }
}

// Chargement des variables d’environnement
const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        ...(IS_DEV
            ? {
                  adminApiPlayground: { settings: { 'request.credentials': 'include' } },
                  adminApiDebug: true,
                  shopApiPlayground: { settings: { 'request.credentials': 'include' } },
                  shopApiDebug: true,
              }
            : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        disableAuth: false, // Activation de l'authentification
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME || 'admin',
            password: process.env.SUPERADMIN_PASSWORD || 'admin',
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET || 'default_secret',
        },
    },
    dbConnectionOptions: {
        type: 'better-sqlite3',
        synchronize: IS_DEV, // Active synchronize uniquement en dev
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: path.join(__dirname, '../vendure.sqlite'),
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    customFields: {},
    catalogOptions: {
        stockDisplayStrategy: new ExactStockDisplayStrategy(),
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            assetUrlPrefix: process.env.ASSET_URL || undefined, // URL configurable via .env
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                fromAddress: process.env.EMAIL_FROM || '"example" <noreply@example.com>',
                verifyEmailAddressUrl: process.env.VERIFY_EMAIL_URL || 'http://localhost:8080/verify',
                passwordResetUrl: process.env.PASSWORD_RESET_URL || 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: process.env.CHANGE_EMAIL_URL || 'http://localhost:8080/verify-email-address-change',
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: process.env.ADMIN_UI_PORT ? +process.env.ADMIN_UI_PORT : serverPort + 2,
            adminUiConfig: {
                apiPort: serverPort,
            },
        }),
        MarquePlugin,    //   Active le plugin dans vendure-config.ts
    ],
};
