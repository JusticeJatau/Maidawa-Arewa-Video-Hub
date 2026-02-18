import Category from "../models/Category.js";

const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Map isActive boolean to status string
    const status = typeof isActive === "boolean" ? (isActive ? "active" : "inactive") : "active";

    const category = await Category.create({
      name,
      description,
      slug,
      status
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: error.message });
  }
};



const getCategories = async(req, res)=>{
    const categories = await Category.find().sort({createdAt: -1})
    res.json(categories);
}

const getCategory = async(req, res) =>{
    const category = await Category.findById(req.params.id);

    if(!category)
        res.status(404).json({message: "category not found"})

    res.json(category)
}

export { createCategory, getCategory, getCategories }