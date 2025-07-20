"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDb = exports.adminAuth = exports.runtime = void 0;
exports.runtime = "nodejs";
var app_1 = require("firebase-admin/app");
var auth_1 = require("firebase-admin/auth");
var firestore_1 = require("firebase-admin/firestore");
var fs = require("fs");
var path = require("path");
// serviceAccountKey.jsonファイルを読み込み
var serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");
var serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
var adminApp = (0, app_1.getApps)().length
    ? (0, app_1.getApps)()[0]
    : (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
    });
exports.adminAuth = (0, auth_1.getAuth)(adminApp);
exports.adminDb = (0, firestore_1.getFirestore)(adminApp);
