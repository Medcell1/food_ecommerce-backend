const express = require('express');
const Menu = require('../models/menu');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); 

// Get all menu items
router.get('/', async (req, res) => {
    try {
      const menuItems = await Menu.find();
      res.json(menuItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


// Get menu item by ID
router.get('/:id', async (req, res) => {
    try {
      const menuItemId = req.params.id;
      const menuItem = await Menu.findById(menuItemId);
  
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
  
      res.json(menuItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
// Create a new menu item
router.post('/', authenticate, async (req, res) => {
    try {
      const { name, price, description, image } = req.body;
  
      // Get the createdBy (user ID) from the authenticated user
      const createdBy = req.user._id;
  
      // Create a new menu item with createdBy information
      const newMenuItem = new Menu({ name, price, description, image, createdBy });
      await newMenuItem.save();
  
      res.status(201).json({ message: 'Menu item created successfully', menuItem: newMenuItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Update menu item by ID
router.put('/:id', async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const { name, price, description, image } = req.body;

    // Update menu item
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      menuItemId,
      { name, price, description, image },
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete menu item by ID
router.delete('/:id', async (req, res) => {
  try {
    const menuItemId = req.params.id;

    // Ensure the menu item exists
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item doesn't exist" });
    }

    // Delete the menu item
    await Menu.findByIdAndDelete(menuItemId);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get menu items created by a particular user
router.get('/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find all menu items where the userId matches
      const menuItems = await Menu.find({ createdBy: userId });
  
      res.json(menuItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router;
