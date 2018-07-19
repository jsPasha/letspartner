const mongoose = require("mongoose");
const Company = mongoose.model("company");
const { templatePath, company } = require("../../data/settings");

const Site = {
  companies: {
    list: (req, res) => {
		const {type} = req.params
		if (type !== 'startup' && type !== 'corporation') return res.send('Error 404');
		
		Company.find({type}, (err, items) => {
			res.send(items)
		})
		
    }
  }
};

module.exports = Site;
