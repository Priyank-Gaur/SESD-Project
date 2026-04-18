import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {User} from './models/User';
import {Order} from './models/Order';
import {Return} from './models/Return';
dotenv.config();
const MONGO_URI=process.env.MONGO_URI||'mongodb://localhost:27017/return-fraud-detection';
const SHARED_ADDRESSES=['123 Oak St, Springfield','456 Elm Ave, Shelbyville','789 Pine Rd, Capital City'];
const SHARED_DEVICES=['fp_device_alpha','fp_device_beta','fp_device_gamma'];
const REASONS=['Product defective','Wrong size','Changed my mind','Item damaged in shipping','Not as described','Found cheaper elsewhere','Defective seal broken'];
const ITEMS=[
  {name: 'Wireless Headphones', price: 120, sealed: false},
  {name: 'Gaming Laptop', price: 2500, sealed: true},
  {name: 'Smart Watch', price: 350, sealed: true},
  {name: 'Designer Handbag', price: 3200, sealed: false},
  {name: 'Mechanical Keyboard', price: 180, sealed: true},
  {name: 'Running Shoes', price: 95, sealed: false},
  {name: '4K Monitor', price: 800, sealed: true},
  {name: 'Premium Sunglasses', price: 450, sealed: true},
  {name: 'Bluetooth Speaker', price: 75, sealed: false},
  {name: 'Gold Necklace', price: 4500, sealed: true}
];
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  await User.deleteMany({});
  await Order.deleteMany({});
  await Return.deleteMany({});
  console.log('Cleared existing data');
  const merchants=[];
  for (let i=1; i<=10; i++) {
    const merchant=await User.create({
      name: `Merchant ${i}`,
      email: `merchant${i}@store.com`,
      passwordHash: 'password123',
      role: 'merchant',
      address: `${i*100} Commerce Blvd`,
      deviceFingerprint: `fp_merchant_${i}`,
      accountCreatedAt: new Date(Date.now()-180*24*60*60*1000)
    });
    merchants.push(merchant);
  }
  console.log(`Created ${merchants.length} merchants`);
  const customers=[];
  for (let i=1; i<=50; i++) {
    const isCluster=i<=15;
    const isFraudRing=i<=6;
    const isNewAccount=i<=8;
    const address=isFraudRing?SHARED_ADDRESSES[i%3]:isCluster?SHARED_ADDRESSES[Math.floor(i/5)%3]:`${i*10} Customer St`;
    const device=isFraudRing?SHARED_DEVICES[i%3]:isCluster&&i%4===0?SHARED_DEVICES[Math.floor(i/4)%3]:`fp_customer_${i}`;
    const accountAge=isNewAccount?Math.floor(Math.random()*5)+1:Math.floor(Math.random()*300)+30;
    const customer=await User.create({
      name: `Customer ${i}`,
      email: `customer${i}@mail.com`,
      passwordHash: 'password123',
      role: 'customer',
      address,
      deviceFingerprint: device,
      accountCreatedAt: new Date(Date.now()-accountAge*24*60*60*1000)
    });
    customers.push(customer);
  }
  console.log(`Created ${customers.length} customers`);
  const orders=[];
  for (let i=0; i<100; i++) {
    const customer=customers[i%customers.length];
    const item=ITEMS[i%ITEMS.length];
    const daysAgo=Math.floor(Math.random()*60)+1;
    const deliveryDaysAgo=i<20?Math.floor(Math.random()*3)+28:Math.floor(Math.random()*25)+5;
    const order=await Order.create({
      userId: customer._id,
      itemName: item.name,
      itemPrice: item.price,
      purchaseDate: new Date(Date.now()-(daysAgo+5)*24*60*60*1000),
      deliveryDate: new Date(Date.now()-deliveryDaysAgo*24*60*60*1000),
      isSealed: item.sealed
    });
    orders.push(order);
  }
  console.log(`Created ${orders.length} orders`);
  const returns=[];
  for (let i=0; i<40; i++) {
    const order=orders[i];
    const customer=customers[i%customers.length];
    const reason=i<10?REASONS[0]:i<15?REASONS[3]:REASONS[Math.floor(Math.random()*REASONS.length)];
    const returnDoc=await Return.create({
      orderId: order._id,
      userId: customer._id,
      reason,
      requestedAt: new Date(Date.now()-Math.floor(Math.random()*14)*24*60*60*1000)
    });
    
    const riskLevel = i % 5 === 0 ? 'HIGH' : i % 3 === 0 ? 'MEDIUM' : 'LOW';
    const score = riskLevel === 'HIGH' ? 85 : riskLevel === 'MEDIUM' ? 55 : 15;
    
    await mongoose.connection.collection('fraudscores').insertOne({
      returnId: returnDoc._id,
      score: score,
      riskLevel: riskLevel,
      strategy: 'rule-based',
      signalBreakdown: [
        { signalName: 'Velocity Check', fired: riskLevel === 'HIGH', contribution: 30, weight: 30 },
        { signalName: 'Cluster Match', fired: riskLevel !== 'LOW', contribution: 25, weight: 25 },
        { signalName: 'Return Window', fired: false, contribution: 0, weight: 15 }
      ],
      createdAt: returnDoc.requestedAt,
      updatedAt: returnDoc.requestedAt
    });

    returns.push(returnDoc);
  }
  console.log(`Created ${returns.length} returns`);
  console.log('\nSeed complete!');
  console.log('Login with: merchant1@store.com / password123');
  await mongoose.disconnect();
}
seed().catch(err=>{
  console.error('Seed failed:', err);
  process.exit(1);
});
