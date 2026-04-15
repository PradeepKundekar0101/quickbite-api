import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/database";
import User from "../models/User";
import Restaurant from "../models/Restaurant";
import Product from "../models/Product";
import Order from "../models/Order";
import ApiConfig from "../models/ApiConfig";

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await ApiConfig.deleteMany({});

  console.log("Cleared existing data");

  // --- Users ---
  const passwordHash = await bcrypt.hash("password123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  const users = await User.insertMany([
    {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91-9876543210",
      passwordHash,
      internalCreditScore: 742,
      accountFlags: ["premium", "verified"],
      lastLoginIp: "103.24.56.78",
      role: "user",
      addresses: [
        { label: "Home", street: "42 MG Road, Indiranagar", city: "Bangalore", zipCode: "560038" },
        { label: "Office", street: "WeWork, Prestige Shantiniketan", city: "Bangalore", zipCode: "560048" },
      ],
    },
    {
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91-9123456789",
      passwordHash,
      internalCreditScore: 680,
      accountFlags: ["verified"],
      lastLoginIp: "49.36.128.90",
      role: "user",
      addresses: [
        { label: "Home", street: "15 Koramangala 4th Block", city: "Bangalore", zipCode: "560034" },
      ],
    },
    {
      name: "QuickBite Admin",
      email: "admin@quickbite.com",
      phone: "+91-9000000001",
      passwordHash: adminHash,
      internalCreditScore: 999,
      accountFlags: ["admin", "superuser"],
      lastLoginIp: "10.0.0.1",
      role: "admin",
      addresses: [
        { label: "Office", street: "QuickBite HQ, HSR Layout", city: "Bangalore", zipCode: "560102" },
      ],
    },
  ]);
  console.log(`Seeded ${users.length} users`);

  // --- Restaurants ---
  const restaurantData = [
    {
      name: "Biryani House",
      cuisine: "Indian",
      rating: 4.5,
      deliveryTime: "30-40 min",
      address: "23 Brigade Road, Bangalore",
      isOpen: true,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
      commissionRate: 0.22,
      internalHealthScore: 92,
      complianceNotes: "Last FSSAI inspection: Jan 2025. All clear. Grade A kitchen.",
    },
    {
      name: "Wok Express",
      cuisine: "Chinese",
      rating: 4.2,
      deliveryTime: "25-35 min",
      address: "56 Church Street, Bangalore",
      isOpen: true,
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
      commissionRate: 0.18,
      internalHealthScore: 78,
      complianceNotes: "Minor ventilation issue flagged in Dec 2024. Follow-up pending.",
    },
    {
      name: "Pizza Palazzo",
      cuisine: "Italian",
      rating: 4.3,
      deliveryTime: "35-45 min",
      address: "8 Residency Road, Bangalore",
      isOpen: true,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      commissionRate: 0.25,
      internalHealthScore: 88,
      complianceNotes: "Franchise. Corporate compliance verified. Next audit: Mar 2025.",
    },
    {
      name: "Taco Loco",
      cuisine: "Mexican",
      rating: 4.0,
      deliveryTime: "20-30 min",
      address: "112 Lavelle Road, Bangalore",
      isOpen: false,
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
      commissionRate: 0.20,
      internalHealthScore: 65,
      complianceNotes: "WARNING: Two customer complaints about hygiene in Nov 2024. Under review.",
    },
    {
      name: "Sakura Sushi",
      cuisine: "Japanese",
      rating: 4.7,
      deliveryTime: "40-50 min",
      address: "3 Vittal Mallya Road, Bangalore",
      isOpen: true,
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
      commissionRate: 0.30,
      internalHealthScore: 96,
      complianceNotes: "Premium partner. Michelin-trained chef. Spotless record.",
    },
  ];

  const restaurants = await Restaurant.insertMany(restaurantData);
  console.log(`Seeded ${restaurants.length} restaurants`);

  // --- Products (4 per restaurant) ---
  const productSets = [
    // Biryani House
    [
      { name: "Hyderabadi Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken, slow-cooked dum style", price: 299, costPrice: 145, category: "Biryani", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", supplierId: "SUP-MEAT-001", internalRating: 4.8 },
      { name: "Paneer Butter Masala", description: "Creamy tomato gravy with soft cottage cheese cubes", price: 249, costPrice: 95, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400", supplierId: "SUP-DAIRY-003", internalRating: 4.5 },
      { name: "Garlic Naan (2 pcs)", description: "Soft tandoor-baked bread with garlic butter", price: 89, costPrice: 22, category: "Bread", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", supplierId: "SUP-FLOUR-002", internalRating: 4.3 },
      { name: "Gulab Jamun (4 pcs)", description: "Golden fried milk dumplings soaked in rose-cardamom syrup", price: 129, costPrice: 35, category: "Dessert", imageUrl: "https://images.unsplash.com/photo-1666190064285-30b1b7cbea21?w=400", supplierId: "SUP-DAIRY-003", internalRating: 4.6 },
    ],
    // Wok Express
    [
      { name: "Chicken Manchurian", description: "Crispy chicken in tangy Indo-Chinese manchurian sauce", price: 269, costPrice: 120, category: "Starters", imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400", supplierId: "SUP-MEAT-001", internalRating: 4.2 },
      { name: "Veg Hakka Noodles", description: "Stir-fried noodles with fresh vegetables and soy sauce", price: 199, costPrice: 65, category: "Noodles", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", supplierId: "SUP-VEG-005", internalRating: 3.9 },
      { name: "Dragon Chicken", description: "Spicy stir-fried chicken with dried red chillies and bell peppers", price: 289, costPrice: 130, category: "Main Course", imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400", supplierId: "SUP-MEAT-001", internalRating: 4.4 },
      { name: "Honey Chilli Potato", description: "Crispy potatoes tossed in honey chilli glaze", price: 179, costPrice: 40, category: "Starters", imageUrl: "https://images.unsplash.com/photo-1623689046286-08050e6a09c0?w=400", supplierId: "SUP-VEG-005", internalRating: 4.1 },
    ],
    // Pizza Palazzo
    [
      { name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, basil, and San Marzano tomato sauce", price: 349, costPrice: 120, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", supplierId: "SUP-CHEESE-007", internalRating: 4.5 },
      { name: "Penne Arrabbiata", description: "Penne pasta in spicy tomato sauce with garlic and chilli flakes", price: 279, costPrice: 85, category: "Pasta", imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", supplierId: "SUP-FLOUR-002", internalRating: 4.0 },
      { name: "Garlic Bread with Cheese", description: "Toasted ciabatta with garlic butter and melted mozzarella", price: 149, costPrice: 35, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1619531040576-f9416740661b?w=400", supplierId: "SUP-CHEESE-007", internalRating: 4.3 },
      { name: "Tiramisu", description: "Italian espresso-soaked ladyfingers with mascarpone cream", price: 199, costPrice: 65, category: "Dessert", imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", supplierId: "SUP-DAIRY-003", internalRating: 4.7 },
    ],
    // Taco Loco
    [
      { name: "Chicken Burrito Bowl", description: "Seasoned chicken with Mexican rice, beans, salsa, and guacamole", price: 329, costPrice: 140, category: "Bowl", imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400", supplierId: "SUP-MEAT-001", internalRating: 4.3 },
      { name: "Crunchy Tacos (3 pcs)", description: "Corn tortilla tacos with seasoned beef, cheese, and pico de gallo", price: 249, costPrice: 95, category: "Tacos", imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", supplierId: "SUP-MEAT-001", internalRating: 4.1 },
      { name: "Loaded Nachos", description: "Crispy tortilla chips with cheese sauce, jalapeños, and sour cream", price: 199, costPrice: 55, category: "Starters", imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400", supplierId: "SUP-VEG-005", internalRating: 3.8 },
      { name: "Churros with Chocolate", description: "Fried dough sticks dusted with cinnamon sugar, served with chocolate sauce", price: 159, costPrice: 40, category: "Dessert", imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400", supplierId: "SUP-FLOUR-002", internalRating: 4.5 },
    ],
    // Sakura Sushi
    [
      { name: "Salmon Nigiri (6 pcs)", description: "Fresh Atlantic salmon slices over seasoned sushi rice", price: 449, costPrice: 220, category: "Sushi", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400", supplierId: "SUP-FISH-009", internalRating: 4.9 },
      { name: "Chicken Katsu Ramen", description: "Rich tonkotsu broth with crispy chicken cutlet and soft-boiled egg", price: 389, costPrice: 170, category: "Ramen", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", supplierId: "SUP-MEAT-001", internalRating: 4.6 },
      { name: "Edamame", description: "Steamed young soybeans with sea salt", price: 149, costPrice: 30, category: "Starters", imageUrl: "https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=400", supplierId: "SUP-VEG-005", internalRating: 4.2 },
      { name: "Matcha Ice Cream", description: "Premium Japanese green tea ice cream", price: 179, costPrice: 55, category: "Dessert", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", supplierId: "SUP-DAIRY-003", internalRating: 4.4 },
    ],
  ];

  const allProducts = [];
  for (let i = 0; i < restaurants.length; i++) {
    const restId = restaurants[i]._id;
    for (const p of productSets[i]) {
      allProducts.push({ ...p, restaurantId: restId, isAvailable: true });
    }
  }

  const products = await Product.insertMany(allProducts);
  console.log(`Seeded ${products.length} products`);

  // Update restaurant menus
  for (let i = 0; i < restaurants.length; i++) {
    const restProducts = products.filter(
      (p) => p.restaurantId.toString() === restaurants[i]._id.toString()
    );
    await Restaurant.findByIdAndUpdate(restaurants[i]._id, {
      menu: restProducts.map((p) => ({ productId: p._id })),
    });
  }
  console.log("Updated restaurant menus");

  // --- Orders ---
  const rahul = users[0];
  const priya = users[1];
  const statuses: Array<"placed" | "preparing" | "delivering" | "delivered" | "cancelled"> = [
    "delivered", "delivered", "delivered", "delivered",
    "delivering", "preparing", "placed", "placed",
    "cancelled", "delivered",
  ];

  const orderData = [];
  for (let i = 0; i < 10; i++) {
    const user = i < 6 ? rahul : priya;
    const restIdx = i % restaurants.length;
    const rest = restaurants[restIdx];
    const restProducts = products.filter(
      (p) => p.restaurantId.toString() === rest._id.toString()
    );

    const numItems = 1 + (i % 3);
    const items = [];
    let total = 0;
    let supplierCost = 0;

    for (let j = 0; j < numItems && j < restProducts.length; j++) {
      const prod = restProducts[j];
      const qty = 1 + (j % 2);
      items.push({
        productId: prod._id.toString(),
        name: prod.name,
        quantity: qty,
        price: prod.price,
      });
      total += prod.price * qty;
      supplierCost += prod.costPrice * qty;
    }

    const deliveryFee = 30;
    total += deliveryFee;

    orderData.push({
      userId: user._id,
      restaurantId: rest._id,
      restaurantName: rest.name,
      items,
      total,
      internalMargin: Math.round((total - supplierCost - deliveryFee * 0.6) * 100) / 100,
      supplierCost,
      deliveryPartnerPayout: 21,
      deliveryFee,
      status: statuses[i],
      deliveryAddress:
        user === rahul
          ? "42 MG Road, Indiranagar, Bangalore 560038"
          : "15 Koramangala 4th Block, Bangalore 560034",
      estimatedDelivery: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000 + 40 * 60 * 1000),
    });
  }

  const orders = await Order.insertMany(orderData);
  console.log(`Seeded ${orders.length} orders`);

  // --- ApiConfig ---
  await ApiConfig.insertMany([
    {
      key: "PAYMENT_GATEWAY_KEY",
      value: "seed_demo_payment_key_replace_with_stripe_secret",
      description: "Stripe live secret key (use env in production)",
      isSecret: true,
    },
    {
      key: "SMS_API_KEY",
      value: "seed_demo_sms_key_replace_with_twilio_secret",
      description: "Twilio SMS API key (use env in production)",
      isSecret: true,
    },
    { key: "DELIVERY_RADIUS_KM", value: "15", description: "Maximum delivery radius in kilometers", isSecret: false },
    { key: "MAX_ORDER_VALUE", value: "5000", description: "Maximum single order value in INR", isSecret: false },
    { key: "SURGE_MULTIPLIER", value: "1.5", description: "Peak hour delivery fee multiplier", isSecret: false },
    { key: "FRAUD_SCORE_THRESHOLD", value: "0.7", description: "ML fraud detection threshold", isSecret: true },
    {
      key: "INTERNAL_ANALYTICS_KEY",
      value: "seed_demo_analytics_key_replace_in_production",
      description: "Internal analytics service key",
      isSecret: true,
    },
  ]);
  console.log("Seeded API configs");

  console.log("\n--- Seed Complete ---");
  console.log("Demo credentials:");
  console.log("  User:  rahul@example.com / password123");
  console.log("  Admin: admin@quickbite.com / admin123");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
