import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, '../data');
const dataFile = path.join(dataDir, 'db.json');
fs.mkdirSync(dataDir, { recursive: true });
const demo = {
  users: [
    { id:'usr-author-1', name:'Priya Sharma', email:'priya@example.com', passwordHash:'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', role:'author' },
    { id:'usr-author-2', name:'Arjun Mehta', email:'arjun@example.com', passwordHash:'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', role:'author' },
    { id:'usr-admin-1', name:'BookLeaf Support', email:'admin@bookleaf.local', passwordHash:'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', role:'admin' }
  ],
  books: [
    { id:'BK001', authorId:'usr-author-1', title:'Whispers of the Ganges', isbn:'978-93-00001-01-1', genre:'Fiction', publicationDate:'2024-04-10', status:'Published & Live', mrp:299, copiesSold:200, royaltyEarned:8400, royaltyPaid:5000, royaltyPending:3400 },
    { id:'BK002', authorId:'usr-author-1', title:'The Quiet Monsoon', isbn:'978-93-00001-02-8', genre:'Poetry', publicationDate:'2025-01-18', status:'Published & Live', mrp:199, copiesSold:65, royaltyEarned:1820, royaltyPaid:1000, royaltyPending:820 },
    { id:'BK003', authorId:'usr-author-2', title:'A Map of Small Dreams', isbn:'978-93-00002-01-0', genre:'Memoir', publicationDate:'2025-03-02', status:'Distribution Setup', mrp:349, copiesSold:0, royaltyEarned:0, royaltyPaid:0, royaltyPending:0 },
    { id:'BK004', authorId:'usr-author-2', title:'Learning to Begin Again', isbn:'978-93-00002-02-7', genre:'Self-help', publicationDate:'2024-11-12', status:'Published & Live', mrp:249, copiesSold:92, royaltyEarned:2760, royaltyPaid:2000, royaltyPending:760 }
  ],
  tickets: [
    { id:'TKT-1001', authorId:'usr-author-1', bookId:'BK001', subject:'Royalty payment pending', description:'I have not received the remaining royalty for the last quarter. Please check the payout status.', category:'Royalty & Payments', priority:'High', status:'Open', assignedTo:null, internalNotes:[], messages:[], createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
    { id:'TKT-1002', authorId:'usr-author-2', bookId:'BK003', subject:'Book listing status', description:'My book is in distribution setup. When will it be available online?', category:'Book Status & Production Updates', priority:'Medium', status:'In Progress', assignedTo:'usr-admin-1', internalNotes:[], messages:[{ id:'MSG-1', senderId:'usr-admin-1', senderName:'BookLeaf Support', body:'Thanks for reaching out. We are checking the distribution setup and will update you within 48 hours.', createdAt:new Date().toISOString() }], createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() }
  ]
};
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(demo, null, 2));
export function readDb(){ return JSON.parse(fs.readFileSync(dataFile, 'utf8')); }
export function writeDb(db){ fs.writeFileSync(dataFile, JSON.stringify(db, null, 2)); }
