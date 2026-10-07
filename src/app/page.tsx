import React from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'AgroVentia | Global Agricultural Sourcing & Trade',
  description:
    'Connecting agricultural producers with global markets through reliable sourcing, market access and trade solutions across Canada, Africa and international markets.',
  keywords:
    'global agricultural sourcing, agricultural trade, agricultural exports, agricultural imports, Canadian agricultural products, Canadian agricultural exporters, African agricultural products, agricultural market access, agricultural commodity sourcing, global food supply, agricultural producers, international agricultural buyers, bulk agricultural products, grains and pulses, oilseeds, cocoa, hibiscus, ginger, wheat, legumes, lentils, sesame Non-durum Wheat, Durum Wheat, Feed Barley, Malting Barley, Malt, Raw Oats, Processed Oats, Oat Flakes, Oat Flour, Red Lentils, Green Lentils, Yellow Peas, Green Peas, Chickpeas, Dry Beans, Kidney Beans, Navy Beans, Pulse Flour, Pea Protein, Lentil Ingredients, Canola Seed, Crude Canola Oil, Refined Canola Oil, Canola Meal, Conventional Soybeans, Food-Grade Soybeans, Identity-Preserved Soybeans, Flaxseed, Linseed, Yellow Mustard Seed, Brown Mustard Seed, Oriental Mustard Seed, Canary Seed, Wheat Gluten, Specialty Plant Proteins, Frozen French Fries, Processed Potatoes, Seed Potatoes, Blueberries, Cranberries, Maple Syrup, Maple Sugar, Dried Hibiscus Flowers, Ginger, Cocoa Beans, Cocoa Products, Kola Nut, Shea Nuts, Shea Butter, Mustard Flour, Prepared Mustard, Dried Spices, Botanical Ingredients, Pulse-Based Feed Ingredients, Pet Food, Livestock Feed Preparations',
};

export default function HomePage() {
  return <HomeClient />;
}
