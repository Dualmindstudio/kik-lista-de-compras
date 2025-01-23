import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  FAB, 
  Card, 
  Text, 
  Chip, 
  Portal, 
  Modal,
  TextInput,
  Button,
  IconButton,
  ActivityIndicator
} from 'react-native-paper';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  emoji?: string;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Frutas",
    "Legumes",
    "Carnes",
    "Laticínios",
    "Mercearia",
    "Bebidas",
    "Outros",
  ]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState('Outros');
  const [newItemEmoji, setNewItemEmoji] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    loadData();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('shopping-items');
      const savedCategories = await AsyncStorage.getItem('shopping-categories');
      
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    AsyncStorage.setItem('shopping-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    AsyncStorage.setItem('shopping-categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Erro', 'Por favor, digite o nome do item');
      return;
    }

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: parseInt(newItemQuantity) || 1,
      category: newItemCategory,
      completed: false,
      emoji: newItemEmoji.trim() || undefined,
    };
    
    setItems([...items, newItem]);
    setIsDialogOpen(false);
    setNewItemName('');
    setNewItemQuantity('1');
    setNewItemCategory('Outros');
    setNewItemEmoji('');
    Alert.alert('Sucesso', 'Item adicionado à lista');
  };

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    Alert.alert('Sucesso', 'Item removido da lista');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Erro', 'Por favor, digite o nome da categoria');
      return;
    }
    if (categories.includes(newCategory.trim())) {
      Alert.alert('Erro', 'Esta categoria já existe!');
      return;
    }
    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
    setIsAddingCategory(false);
    Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
  };

  const filteredItems = filterCategory === "all" 
    ? items 
    : items.filter(item => item.category === filterCategory);

  const pendingItems = filteredItems.filter(item => !item.completed);
  const completedItems = filteredItems.filter(item => item.completed);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.splashText}>KIK</Text>
        <Text style={styles.splashSubtext}>Lista de Compras</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        <Chip
          selected={filterCategory === "all"}
          onPress={() => setFilterCategory("all")}
          style={styles.chip}
        >
          Todos
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category}
            selected={filterCategory === category}
            onPress={() => setFilterCategory(category)}
            style={styles.chip}
          >
            {category}
          </Chip>
        ))}
        {isAddingCategory ? (
          <View style={styles.addCategoryContainer}>
            <TextInput
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Nova categoria"
              style={styles.categoryInput}
            />
            <Button onPress={handleAddCategory}>✓</Button>
          </View>
        ) : (
          <IconButton
            icon="plus"
            onPress={() => setIsAddingCategory(true)}
          />
        )}
      </ScrollView>

      <ScrollView style={styles.listContainer}>
        {pendingItems.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.itemInfo}>
                <IconButton
                  icon={item.completed ? "check" : "circle-outline"}
                  onPress={() => toggleItem(item.id)}
                  color={item.completed ? "#22c55e" : "#3b82f6"}
                />
                <View>
                  <Text style={[
                    styles.itemName,
                    item.completed && styles.completedText
                  ]}>
                    {item.emoji} {item.name}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} × {item.category}
                  </Text>
                </View>
              </View>
              <IconButton
                icon="delete"
                onPress={() => removeItem(item.id)}
                color="#ef4444"
              />
            </Card.Content>
          </Card>
        ))}

        {completedItems.length > 0 && (
          <>
            <View style={styles.completedDivider}>
              <Text style={styles.completedTitle}>Itens comprados</Text>
            </View>
            {completedItems.map((item) => (
              <Card key={item.id} style={[styles.card, styles.completedCard]}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.itemInfo}>
                    <IconButton
                      icon={item.completed ? "check" : "circle-outline"}
                      onPress={() => toggleItem(item.id)}
                      color={item.completed ? "#22c55e" : "#3b82f6"}
                    />
                    <View>
                      <Text style={[
                        styles.itemName,
                        item.completed && styles.completedText
                      ]}>
                        {item.emoji} {item.name}
                      </Text>
                      <Text style={styles.itemDetails}>
                        {item.quantity} × {item.category}
                      </Text>
                    </View>
                  </View>
                  <IconButton
                    icon="delete"
                    onPress={() => removeItem(item.id)}
                    color="#ef4444"
                  />
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={isDialogOpen}
          onDismiss={() => setIsDialogOpen(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Adicionar Novo Item</Text>
          <View style={styles.modalContent}>
            <View style={styles.emojiNameContainer}>
              <TextInput
                style={styles.emojiInput}
                value={newItemEmoji}
                onChangeText={setNewItemEmoji}
                placeholder="😋"
                maxLength={2}
              />
              <TextInput
                style={styles.nameInput}
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="Nome do item"
              />
            </View>
            <View style={styles.quantityCategoryContainer}>
              <TextInput
                style={styles.quantityInput}
                value={newItemQuantity}
                onChangeText={setNewItemQuantity}
                keyboardType="numeric"
                placeholder="Quantidade"
              />
              <View style={styles.categorySelect}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setNewItemCategory(categories[0]);
                  }}
                >
                  {newItemCategory}
                </Button>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={handleAddItem}
              style={styles.addButton}
            >
              Adicionar
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsDialogOpen(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 16,
  },
  splashSubtext: {
    fontSize: 16,
    color: '#60a5fa',
    marginTop: 8,
  },
  categoriesContainer: {
    padding: 8,
  },
  chip: {
    marginRight: 8,
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryInput: {
    width: 120,
    marginRight: 8,
  },
  listContainer: {
    flex: 1,
    padding: 8,
  },
  card: {
    marginBottom: 8,
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#22c55e',
  },
  completedDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalContent: {
    gap: 16,
  },
  emojiNameContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  emojiInput: {
    width: 60,
    textAlign: 'center',
  },
  nameInput: {
    flex: 1,
  },
  quantityCategoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityInput: {
    flex: 1,
  },
  categorySelect: {
    flex: 1,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#3b82f6',
  },
});

export default ShoppingList;