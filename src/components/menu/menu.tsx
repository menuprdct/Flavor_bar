'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FoodItem } from '@/types/types';
import FoodList from '../foodList/foodList';
import styles from './menu.module.css';

export default function Menu() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    async function fetchFoodItems() {
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          id,
          name,
          price,
          image_urls,
          category,
          desc,
          reviews (
            rating,
            comment,
            user_email
          )
        `).order('id', { ascending: true });

      if (error) {
        console.error('Error fetching food items:', error);
        return;
      }
      setFoodItems(data || []);
    }

    fetchFoodItems();
  }, []);

  return (
    <div className={styles.menuContainer}>
      <FoodList foodItems={foodItems} />
    </div>
  );
}
