const City = require("./City");
const Hotel = require("./Hotel");
const Image = require("./Image");

City.hasMany(Hotel)
Hotel.belongsTo(City)

Hotel.hasMany(Image)
Image.belongsTo(Hotel)