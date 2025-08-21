const User = require('../models/usersModel');

const getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ preferences: user.preferences || [] });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        if (!Array.isArray(preferences)) {
            return res.status(400).json({ message: 'Preferences must be an array of strings' });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { preferences },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ preferences: user.preferences });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getPreferences,
    updatePreferences
};
