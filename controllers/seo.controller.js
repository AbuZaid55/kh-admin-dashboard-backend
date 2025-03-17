const SEO=require("../models/seo.model.js");

const getSeo=async (req, res) => {
    try {
      const entries = await SEO.find().sort({ updated_at: -1 });
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getSeoById=async (req, res) => {
    try {
      const entry = await SEO.findById(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: 'SEO entry not found' });
      }
      res.json(entry);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};
  

const createSeo= async (req, res) => {
    try {
      const newEntry = new SEO(req.body);
      await newEntry.save();
      res.status(201).json(newEntry);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
      }
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Page URL must be unique', field: 'page' });
      }
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};
      
const updateSeo=async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        updated_at: Date.now()
      };
      
      const entry = await SEO.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!entry) {
        return res.status(404).json({ message: 'SEO entry not found' });
      }
      
      res.json(entry);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
      }
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Page URL must be unique', field: 'page' });
      }
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};
  

const deleteSeo=async (req, res) => {
    try {
      const entry = await SEO.findByIdAndDelete(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: 'SEO entry not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};
   
const searchSeo=async (req, res) => {
    try {
      const searchTerm = req.params.term;
      const entries = await SEO.find({
        $or: [
          { page: { $regex: searchTerm, $options: 'i' } },
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { page_name: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ updated_at: -1 });
      
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};


module.exports = {getSeo,getSeoById,createSeo,updateSeo,deleteSeo,searchSeo};