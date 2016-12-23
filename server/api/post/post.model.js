'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Post', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: DataTypes.STRING,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    published_at: DataTypes.STRING,
    tags: DataTypes.STRING,
    picture: DataTypes.STRING,
    category: DataTypes.STRING,
    subscribe_offer: DataTypes.INTEGER,
    content: DataTypes.TEXT
  });
}
